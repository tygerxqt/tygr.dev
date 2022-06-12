import { Stack, Heading, Divider, Text, Button, ButtonGroup, useToast, Skeleton, Spinner, Center, Flex, Input, Box } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import supabase from "../../../lib/SupabaseClient";
import { UserProfile } from "../../../types/Account/UserProfile";
import { useRouter } from "next/router";

export default function Billing() {
    const user = supabase.auth.user();
    const router = useRouter();

    const [userData, setUserData] = useState({} as UserProfile);
    const [customer, setCustomer] = useState({} as Stripe.Customer);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newCustomerName, setNewCustomerName] = useState(user.user_metadata.full_name);
    const [newCustomerEmail, setNewCustomerEmail] = useState(user.email);

    async function createCustomer() {
        setLoading(true);

        await axios.post(`/api/billing/customers/create`, {
            email: newCustomerEmail,
            name: newCustomerName,
        }).then(response => {
            setCustomer(response.data as Stripe.Customer);
        }).catch(error => {
            throw new Error(error.response.data.error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const loadPortal = async () => {
        const { data } = await axios.get(`/api/billing/portal?redirect=account`);
        router.push(data.data);
    }

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            await axios.get(`/api/users/${user.id}`).then(response => {
                setUserData(response.data as UserProfile)
            }).catch(error => {
                throw new Error(error.response.data.error);
            });

            await axios.get(`api/billing/customers/fetch`).then(response => {
                setCustomer(response.data as Stripe.Customer);
            }).catch(error => {
                throw new Error(error.response.data.error);
            }).finally(() => {
                setLoading(false);
                setUpdate(false);
            });
        }

        if (session) {
            fetch();
        } else {
            setLoading(false);
        }
    }, [update]);

    return (
        <>
            <Stack spacing={5}>
                <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
                    Billing
                </Heading>
                <Divider />
                <Text fontSize={{ base: "md", md: "lg" }}>
                    Manage your billing information and subscription.
                </Text>
                {loading ? (
                    <>
                        <Spinner />
                    </>
                ) : (
                    <>
                        {customer ? (
                            <>
                                {userData.pixel ? (
                                    <>
                                        <Text fontSize={{ base: "md", md: "lg" }}>
                                            You are subscribed.
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Text fontSize={{ base: "md", md: "lg" }}>
                                            You are <b>not</b> subscribed.
                                        </Text>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Text fontSize={{ base: "md", md: "lg" }}>
                                    We have used your Pixel account information to auto-fill the form below. If anything is incorrect, please change it now.
                                </Text>
                            </>
                        )}
                    </>
                )}
                {loading ? (
                    <>
                    </>
                ) : (
                    <>
                        {userData.pixel ? (
                            <>
                                <ButtonGroup spacing={5}>
                                    <Link href="/dashboard" passHref>
                                        <Button colorScheme="gray">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button colorScheme="gray" onClick={() => loadPortal()}>
                                        Edit information
                                    </Button>
                                </ButtonGroup>
                            </>
                        ) : (
                            <>
                                <ButtonGroup spacing={5}>
                                    {customer ? (
                                        <>
                                            <Link href="/pixels" passHref>
                                                <Button>
                                                    Subscribe
                                                </Button>
                                            </Link>
                                            <Button colorScheme="gray" onClick={() => loadPortal()}>
                                                Edit billing information
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Stack spacing={"3vh"}>
                                                <Stack>
                                                    <Heading fontSize={["xl", "xl", "lg", "lg"]}>Name</Heading>
                                                    <Input value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} />
                                                </Stack>
                                                <Stack>
                                                    <Heading fontSize={["xl", "xl", "lg", "lg"]}>Email</Heading>
                                                    <Input value={newCustomerEmail} onChange={(e) => setNewCustomerEmail(e.target.value)} />
                                                </Stack>
                                                <Stack>
                                                    <ButtonGroup>
                                                        <Button onClick={() => createCustomer()} loadingText="Creating..." isLoading={loading}>
                                                            Create customer
                                                        </Button>
                                                    </ButtonGroup>
                                                </Stack>
                                            </Stack>
                                        </>
                                    )}

                                </ButtonGroup>
                            </>
                        )}
                    </>
                )}
            </Stack>
        </>
    )
}