import { Flex, Center, Stack, Spinner, Heading, Divider, Text, UnorderedList, ListItem, Box, SimpleGrid, Select, ButtonGroup, Button, Input, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, toast, useToast } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "../../components/UI/Container";
import Navbar from "../../components/UI/Navbar";
import useMediaQuery from "../../hook/useMediaQuery";
import stripe from "../../lib/Stripe"
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/Auth";

export default function Pricing({ plans }) {
    const { userData, update, session, user } = useAuth();
    const router = useRouter();

    const [selectedPlan, setSelectedPlan] = useState("price_1L7Q5GCvkEhaRfsbD0rGp102");

    const [newCustomerName, setNewCustomerName] = useState(user ? user.user_metadata.full_name : "");
    const [newCustomerEmail, setNewCustomerEmail] = useState(user ? user.email : "");
    const [loading, setLoading] = useState(false);

    const loadPortal = async () => {
        await axios.get(`/api/billing/portal?redirect=pixels`).then(res => {
            router.push(res.data.data);
        }).catch(err => {
            console.log(err.response.data.error);
        });
    }

    const isLargerThan768 = useMediaQuery(768);

    async function createCustomer() {
        setLoading(true);
        const { data, status } = await axios.post(`api/billing/customers/create`, {
            email: newCustomerEmail,
            name: newCustomerName,
        });

        if (status != 200) throw new Error(data.message);
        update();
        setLoading(false);
    }

    const processSubscription = planId => async () => {
        const { data } = await axios.get(`/api/billing/subscriptions/${planId}`);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
        await stripe.redirectToCheckout({ sessionId: data.data });
    }

    const Info = () => {
        return (
            <>
                <Container enableTransition={false}>
                    <Head>
                        <title>Pixels</title>
                        <meta name="title" content="Log in" />
                        <meta
                            name="description"
                            content="Log in to your Pixel account to see this page."
                        />

                        <meta property="og:type" content="website" />
                        <meta property="og:url" content="https://www.tygr.dev/profile" />
                        <meta property="og:title" content="tygerxqt" />
                        <meta
                            property="og:description"
                            content="Log in to your Pixel account to see this page."
                        />
                        <meta property="og:image" content="https://images.ctfassets.net/547zkxycwgvr/4JPYvu5J5MXi5G4MpHF5qH/1f47ef5e0fee9dd8a23882cc716d1486/PixelSEO.png" />

                        <meta property="twitter:card" content="summary_large_image" />
                        <meta property="twitter:url" content="https://tygr.dev/profile" />
                        <meta property="twitter:title" content="tygerxqt" />
                        <meta
                            property="twitter:description"
                            content="Log in to your Pixel account to see this page."
                        />
                        <meta
                            property="twitter:image"
                            content="https://images.ctfassets.net/547zkxycwgvr/4JPYvu5J5MXi5G4MpHF5qH/1f47ef5e0fee9dd8a23882cc716d1486/PixelSEO.png"
                        />
                    </Head>
                    <Stack my="12.5vh" justifyContent="center">
                        <Stack justifyContent="center" alignItems="center">
                            <Stack
                                w={["100vw", "95vw"]}
                                maxW="680px"
                                spacing={5}
                                p={4}
                            >
                                <Center>
                                    <Heading fontSize={["3xl", "3xl", "5xl", "5xl"]}>Pixels</Heading>
                                </Center>
                                <Divider />
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
                                <Center mt={"3vh"}>
                                    <ButtonGroup>
                                        <Link href="/account" passHref>
                                            <Button>
                                                Log in to continue
                                            </Button>
                                        </Link>
                                    </ButtonGroup>
                                </Center>
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
                {userData === undefined ? (
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
                                        {userData.customer.id ? (
                                            <>
                                                <Box border={"1px"} borderColor={"#242424"} p={4} rounded={"lg"} >
                                                    <Stack spacing={"3vh"}>
                                                        <Stack>
                                                            <Heading fontSize={["xl", "xl", "lg", "lg"]}>Customer</Heading>
                                                            <Text fontSize={{ base: "md", md: "lg" }}>
                                                                The button below will redirect you to your billing portal where you can update your billing information.
                                                            </Text>
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
                                                        <Button onClick={processSubscription(selectedPlan)} disabled={!userData.customer}>
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
            {userData === undefined && !user ? (
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
                                        Loading...
                                    </Text>
                                </Center>
                            </Stack>
                        </Center>
                    </Flex>
                </>
            ) : (
                <>
                    {userData ? (
                        <>
                            {userData.pixel ? (
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