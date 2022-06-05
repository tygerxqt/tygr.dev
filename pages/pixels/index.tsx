import { Flex, Center, Stack, Spinner, Heading, Divider, Text, UnorderedList, ListItem, Box, useColorMode, SimpleGrid, Select, ButtonGroup, Button, Input, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import Container from "../../components/UI/Container";
import Navbar from "../../components/UI/Navbar";
import useMediaQuery from "../../hook/useMediaQuery";
import stripe from "../../lib/Stripe"
import supabase from "../../lib/SupabaseClient";
import { UserProfile } from "../../types/UserProfile";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

export default function Pricing({ plans }) {
    const user = supabase.auth.user();
    const session = supabase.auth.session();
    const router = useRouter();

    const [userData, setUserData] = useState({} as UserProfile);
    const [customer, setCustomer] = useState({} as Stripe.Customer);
    const [update, setUpdate] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedPlan, setSelectedPlan] = useState("price_1L7E5lCvkEhaRfsbUYDWXUVF");

    const [newCustomerName, setNewCustomerName] = useState(customer.name);
    const [newCustomerEmail, setNewCustomerEmail] = useState(customer.email);

    const loadPortal = async () => {
        await axios.get(`/api/billing/portal?token=${session.access_token}`).then(res => {
            router.push(res.data.data);
        }).catch(err => {
            console.log(err.response.data.error);
        });
    }

    const isLargerThan768 = useMediaQuery(768);

    useEffect(() => {
        const user = supabase.auth.user();
        const session = supabase.auth.session();

        async function fetch() {
            const { data, status: dataStatus } = await axios.get(`/api/users/${user.id}?token=${session.access_token}`);
            if (dataStatus != 200) throw new Error(data.message);
            const { data: customerData, status: customerStatus } = await axios.get(`api/billing/customers/fetch?token=${session.access_token}`);
            if (customerStatus != 200) throw new Error(customerData.message);
            setUserData(data as UserProfile);
            setCustomer(customerData.data);
            setLoading(false);
            setUpdate(false);

            setNewCustomerEmail(user.email);
            setNewCustomerName(user.user_metadata.full_name);
        }

        if (session) {
            fetch();
        } else {
            setLoading(false);
        }
    }, [update]);

    async function createCustomer() {
        const session = supabase.auth.session();

        const { data, status } = await axios.post(`api/billing/customers/create?token=${session.access_token}`, {
            email: newCustomerEmail,
            name: newCustomerName,
        });

        if (status != 200) throw new Error(data.message);
        setCustomer(data.data);
        setUpdate(true);
    }

    const processSubscription = planId => async () => {
        const { data } = await axios.get(`/api/billing/subscriptions/${planId}?token=${session.access_token}`);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
        await stripe.redirectToCheckout({ sessionId: data.data });
    }

    const Info = () => {
        return (
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
                                <Box mt={"3vh"}>
                                    <ButtonGroup>
                                        <Link href="/account" passHref>
                                            <Button>
                                                Log in to continue
                                            </Button>
                                        </Link>
                                    </ButtonGroup>
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </>
        )
    }

    const Subscribe = () => {
        return (
            <>
                {loading ? (
                    <>
                        <Spinner />
                    </>
                ) : (
                    <>
                        <Container enableTransition={false}>
                            <Head>
                                <title>Pixels</title>
                            </Head>
                            <Stack my="10vh" justifyContent="center">
                                <Stack justifyContent="center" alignItems="center" mb={"3vh"}>
                                    <Heading fontSize={["3xl", "3xl", "5xl", "5xl"]}>Subscribe</Heading>
                                    <Text fontSize={{ base: "md", md: "lg" }} mt={"3vh"}>
                                        Get access to behind the scenes content, early access to new projects, access to all private repositories on GitHub, and more today!
                                    </Text>
                                </Stack>
                                <SimpleGrid
                                    columns={[1, 1, 2, 2]}
                                    spacing={5}
                                    mt={"5vh"}
                                    mb={"3vh"}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Stack p={4} rounded={"xl"}>
                                        <Heading fontSize={["2xl", "2xl", "3xl", "3xl"]}>Perks</Heading>
                                        <UnorderedList spacing={8}>
                                            <ListItem>Pixel role in the Discord server. This unlocks hidden channels, double chat XP, extra bot commands, and more.</ListItem>
                                            <ListItem>Behind the scenes content for all projects including constant updates for public and private projects, access to all origianal and RAW assets used in projects, access to the project vault, and the project roadmap.</ListItem>
                                            <ListItem>Early access to new projects, content and other media.</ListItem>
                                            <ListItem>Access to my entire photo library. All assets will be in their RAW format, and you will be able to use them for any of your projects.</ListItem>
                                            <ListItem>Access to all private repositories on GitHub.</ListItem>
                                            <ListItem>A Pixel perfect badge to show your support.</ListItem>
                                        </UnorderedList>
                                    </Stack>
                                    <Stack spacing={10}>
                                        {customer ? (
                                            <>
                                                <Box border={"1px"} borderColor={"#242424"} p={4} rounded={"lg"} >
                                                    <Stack spacing={"3vh"}>
                                                        <Stack>
                                                            <Heading fontSize={["xl", "xl", "lg", "lg"]}>Customer</Heading>
                                                            <Text fontSize={{ base: "md", md: "lg" }}>
                                                                These details are used to contact you for anything regarding billing.
                                                            </Text>
                                                        </Stack>
                                                        <Stack>
                                                            <Heading fontSize={["xl", "xl", "lg", "lg"]}>Name</Heading>
                                                            <Input
                                                                defaultValue={newCustomerName}
                                                                disabled={true}
                                                            ></Input>
                                                        </Stack>
                                                        <Stack>
                                                            <Heading fontSize={["xl", "xl", "lg", "lg"]}>Email</Heading>
                                                            <Input
                                                                value={newCustomerEmail}
                                                                disabled={true}
                                                            ></Input>
                                                        </Stack>
                                                        <Stack>
                                                            <ButtonGroup>
                                                                <Button onClick={() => loadPortal()}>
                                                                    Edit billing information
                                                                </Button>
                                                            </ButtonGroup>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                <Box border={"1px"} borderColor={"#242424"} p={4} rounded={"lg"}>
                                                    <Stack spacing={"3vh"}>
                                                        <Stack>
                                                            <Heading fontSize={["xl", "xl", "lg", "lg"]}>Customer</Heading>
                                                            <Text fontSize={{ base: "md", md: "lg" }}>
                                                                We have used your Pixel account information to auto-fill the form below. If anything is incorrect, please change it now.
                                                            </Text>
                                                        </Stack>
                                                        <Stack>
                                                            <Heading fontSize={["xl", "xl", "lg", "lg"]}>Name</Heading>
                                                            <Input value={newCustomerName} />
                                                        </Stack>
                                                        <Stack>
                                                            <Heading fontSize={["xl", "xl", "lg", "lg"]}>Email</Heading>
                                                            <Input value={newCustomerEmail} />
                                                        </Stack>
                                                        <Stack>
                                                            <ButtonGroup>
                                                                <Button onClick={() => createCustomer()} loadingText="Creating..." isLoading={loading}>
                                                                    Create customer
                                                                </Button>
                                                            </ButtonGroup>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            </>
                                        )}
                                        <Box border={"1px"} borderColor={"#242424"} p={4} rounded={"lg"}>
                                            <Stack spacing={"3vh"}>
                                                <Stack>
                                                    <Heading fontSize={["xl", "xl", "lg", "lg"]}>Pixel</Heading>
                                                    <Text fontSize={{ base: "md", md: "lg" }}>
                                                        Stripe manages all payments for tygr.dev. You will be redireced there.
                                                    </Text>
                                                </Stack>
                                                <Stack>
                                                    <Heading fontSize={["xl", "xl", "lg", "lg"]}>Plan</Heading>
                                                    <Select fontSize={{ base: "md", md: "lg" }} onChange={(e) => setSelectedPlan(e.target.value)} value={selectedPlan}>
                                                        {plans.map((plan) => (
                                                            <option key={plan.id} value={plan.id}>${plan.price / 100} / month</option>
                                                        ))}
                                                    </Select>
                                                </Stack>
                                                <Stack>
                                                    <ButtonGroup>
                                                        <Button onClick={processSubscription(selectedPlan)} disabled={!customer}>
                                                            Subscribe
                                                        </Button>
                                                    </ButtonGroup>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </SimpleGrid>
                            </Stack>
                        </Container>
                    </>
                )}
            </>
        )
    }

    const Dashboard = () => {
        useEffect(() => {
            setTimeout(() => {
                window.location.href = "/dashboard"
            }, 1000);
        });

        return (
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
                                    Redirecting...
                                </Text>
                            </Center>
                        </Stack>
                    </Center>
                </Flex>
            </>
        )
    }

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
                                        Checking subscription status...
                                    </Text>
                                </Center>
                            </Stack>
                        </Center>
                    </Flex>
                </>
            ) : (
                <>
                    {session ? (
                        <>
                            {userData.badges.pixel ? (
                                <>
                                    <Dashboard />
                                </>
                            ) : (
                                <>
                                    <Subscribe />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Info />
                        </>
                    )}

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