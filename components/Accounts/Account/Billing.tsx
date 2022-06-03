import { Stack, Heading, Divider, Text, Button, ButtonGroup, useToast, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import supabase from "../../../lib/SupabaseClient";
import { UserProfile } from "../../../types/UserProfile";

export default function Billing({ userData }) {
    const [customer, setCustomer] = useState({} as Stripe.Customer);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            const { data, status: dataStatus } = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
            if (dataStatus != 200) throw new Error(data.message);

            const { data: customerData, status: customerStatus } = await axios.get(`api/billing/customers/fetch?token=${session.access_token}`);
            if (customerStatus != 200) throw new Error(customerData.message);

            setCustomer(customerData.data)
            setLoading(false);
            setUpdate(false);
        }

        fetch();
    }, [update]);

    async function createCustomer() {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        const { data, status } = await axios.post(`api/billing/customers/create`, {
            token: session.access_token,
            email: user.email,
            name: user.user_metadata.full_name,
        });

        if (status != 200) throw new Error(data.message);
        setCustomer(data.data);
        setUpdate(true);
    }

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
                <Text fontSize={{ base: "md", md: "lg" }}>
                    You are <b>not</b> subscribed. The button below will direct you to the subscription page.
                </Text>
                {customer ? (
                    <>
                        <Skeleton isLoaded={!loading}>
                            {userData.badges.pixel ? (
                                <>
                                    <ButtonGroup spacing={5}>
                                        <Button colorScheme="gray" variant={"solid"}>
                                            Edit information
                                        </Button>
                                        <Button colorScheme="gray" variant={"solid"}>
                                            Dashboard
                                        </Button>
                                    </ButtonGroup>
                                </>
                            ) : (
                                <>
                                    <ButtonGroup spacing={5}>
                                        <Link href="/pixels/subscribe" passHref>
                                            <Button colorScheme="gray">
                                                Subscribe
                                            </Button>
                                        </Link>
                                    </ButtonGroup>
                                </>
                            )}
                        </Skeleton>
                    </>
                ) : (
                    <>
                        <Skeleton isLoaded={!loading}>
                            <ButtonGroup>
                                <Button
                                    onClick={() => {
                                        createCustomer();
                                    }}
                                    isLoading={loading}
                                    loadingText="Creating customer..."
                                >
                                    Create Customer
                                </Button>
                            </ButtonGroup>
                        </Skeleton>
                    </>
                )}
            </Stack>
        </>
    )
}