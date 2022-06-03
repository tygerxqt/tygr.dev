import { Flex, Center, Stack, Spinner, Heading, Divider, Text, UnorderedList, ListItem, Box, useColorMode, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import Billing from "../../components/Accounts/Account/Billing";
import Identities from "../../components/Accounts/Account/Identities";
import Removal from "../../components/Accounts/Account/Removal";
import Container from "../../components/UI/Container";
import Navbar from "../../components/UI/Navbar";
import useMediaQuery from "../../hook/useMediaQuery";
import stripe from "../../lib/Stripe"
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/UserProfile";

export default function Pricing({ plans }) {
    const [userData, setUserData] = useState({} as UserProfile);
    const [customer, setCustomer] = useState({} as Stripe.Customer);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);

    const isLargerThan768 = useMediaQuery(768);

    const { colorMode, toggleColorMode } = useColorMode();

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            const { data, status: dataStatus } = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
            if (dataStatus != 200) throw new Error(data.message);
            const { data: customerData, status: customerStatus } = await axios.get(`api/billing/customers/fetch?token=${session.access_token}`);
            if (customerStatus != 200) throw new Error(customerData.message);
            setUserData(data.data as UserProfile);
            setCustomer(customerData.data)
            setLoading(false);
            setUpdate(false);
        }

        fetch();
    }, [update]);

    return (
        <>
            {loading ? (
                <>
                    <Navbar enableTransition={false} />
                    <Flex
                        as="main"
                        justifyContent="center"
                        px={isLargerThan768 ? "15vw" : "8vw"}
                        py={isLargerThan768 ? "4vw" : "8vw"}
                    >
                        <Center>
                            <Stack
                                spacing={10}
                                justifyContent="center"
                                my={["20vh", "20vh", "30vh", "30vh"]}
                            >
                                <Center>
                                    <Spinner size={"xl"} />
                                </Center>
                                <Center>
                                    <Text fontSize="xl" fontWeight="bold">
                                        Fetching user data...
                                    </Text>
                                </Center>
                            </Stack>
                        </Center>
                    </Flex>
                </>
            ) : (
                <>
                    <Container enableTransition={false}>
                        <Head>
                            <title>Pixels</title>
                        </Head>
                        <Stack my="12.5vh" justifyContent="center">
                            <Stack justifyContent="center" alignItems="center">
                                <Heading fontSize={["3xl", "3xl", "5xl", "5xl"]}>Pixels</Heading>
                                <Divider />
                                <Stack
                                    w={["100vw", "95vw"]}
                                    maxW="680px"
                                    spacing={5}
                                >
                                    <Text fontSize={{ base: "md", md: "lg" }} mt={"3vh"}>
                                        Pixels is a subscription service provided by tygerxqt that starts at a minimum of $1 a month. Pixel was created to provide a way for people to support tygerxqt and gain rewards and perks in return. <br /><br /> Being a Pixel subscriber grants you access to the following perks and rewards:
                                    </Text>
                                    <Box border={"1px"} borderColor={"#242424"} p={4} rounded={"xl"}>
                                        <UnorderedList spacing={8}>
                                            <ListItem>Pixel role in the Discord server. This unlocks hidden channels, double chat XP, extra bot commands, and more.</ListItem>
                                            <ListItem>Behind the scenes content for all projects including constant updates for public and private projects, access to all origianal and RAW assets used in projects, access to the project vault, and the project roadmap.</ListItem>
                                            <ListItem>Early access to new projects, content and other media.</ListItem>
                                            <ListItem>Access to my entire photo library. All assets will be in their RAW format, and you will be able to use them for any of your projects.</ListItem>
                                            <ListItem>Access to all private repositories on GitHub.</ListItem>
                                            <ListItem>A Pixel perfect badge to show your support.</ListItem>
                                        </UnorderedList>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Container>
                </>
            )}
        </>
    )
}

export const getStaticProps = async () => {
    const { data: prices } = await stripe.prices.list();

    const plans = await Promise.all(prices.map(async (price) => {
        const product = await stripe.products.retrieve(price.product as string);
        return {
            id: price.id,
            name: product.name,
            price: price.unit_amount,
            interval: price.recurring.interval,
            currency: price.currency,
        }
    }));

    const sortedPlans = plans.sort((a, b) => a.price - b.price);

    return {
        props: {
            plans: sortedPlans,
        }
    }
}