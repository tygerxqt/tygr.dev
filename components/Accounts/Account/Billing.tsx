import { Stack, Heading, Divider, Text, Button, ButtonGroup, useToast, Skeleton, Spinner, Center, Flex, Input, Box } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import supabase from "../../../lib/SupabaseClient";
import { UserProfile } from "../../../types/UserProfile";
import { useRouter } from "next/router";

export default function Billing() {
    const user = supabase.auth.user();
    const session = supabase.auth.session();
    const router = useRouter();

    const [userData, setUserData] = useState({} as UserProfile);
    const [customer, setCustomer] = useState({} as Stripe.Customer);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newCustomerName, setNewCustomerName] = useState(user.user_metadata.full_name);
    const [newCustomerEmail, setNewCustomerEmail] = useState(user.email);

    async function createCustomer() {
        setLoading(true);
        const session = supabase.auth.session();

        const { data, status } = await axios.post(`api/billing/customers/create?token=${session.access_token}`, {
            email: newCustomerEmail,
            name: newCustomerName,
        });

        if (status != 200) throw new Error(data.message);
        setCustomer(data.data);
        setUpdate(true);
        setLoading(false);
    }

    const loadPortal = async () => {
        const { data } = await axios.get(`/api/billing/portal?token=${session.access_token}`);
        router.push(data.data);
    }

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            const { data, status: dataStatus } = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
            if (dataStatus != 200) throw new Error(data.message);
            const { data: customerData, status: customerStatus } = await axios.get(`api/billing/customers/fetch?token=${session.access_token}`);
            if (customerStatus != 200) throw new Error(customerData.message);
            setUserData(data as UserProfile);
            setCustomer(customerData.data)
            setLoading(false);
            setUpdate(false);
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
                                {userData.badges.pixel ? (
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
                        {userData.badges.pixel ? (
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