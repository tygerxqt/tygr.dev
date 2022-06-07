import { Stack, Heading, Divider, Text, SimpleGrid, Box, Image, chakra, Tooltip } from "@chakra-ui/react";
import { createClient } from "contentful";
import PremiumContainer from "../../components/Accounts/PremiumContainer";
import FileSaver from "file-saver";
import { useState } from "react";
import { BiDownload } from "react-icons/bi";
import Head from "next/head";

export default function PhotographyPage({ images }) {
    const [hover, setHover] = useState(false);
    const [hoverId, setHoverId] = useState(null);
    return (
        <>
            <PremiumContainer>
                <Head>
                    <title>Photography</title>
                </Head>
                <Stack spacing={10} my={["10vh", "10vh", "15vh", "15vh"]}>
                    <Stack spacing={5}>
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Photograhy</Heading>
                        <Divider />
                        <Text fontSize={{ base: "md", md: "lg" }}>
                            The full catalogue of images from my Photography libaray. You are able to use these images in your projects.
                        </Text>
                    </Stack>
                    <Stack spacing={5}>
                        {images.map((item) => {
                            return (
                                <>
                                    <Heading fontSize={{ base: "2xl", md: "4xl" }}>{item.fields.title} </Heading>
                                    <Divider />
                                    <SimpleGrid columns={[1, 1, 2, 2]} spacing={5}>
                                        {item.fields.images.map((img) => {
                                            return (
                                                <>
                                                    <Box onClick={() => { FileSaver.saveAs("https:" + img.fields.file.url, img.fields.file.fileName) }} transition={"filter 0.2s ease-out"}>
                                                        {hover && hoverId === img.fields.title ? (
                                                            <>
                                                                <Box pos="relative" rounded={"xl"}>
                                                                    <Image src={img.fields.file.url} alt={img.fields.title} border="1px" borderColor={"#242424"} rounded={"xl"} filter={"blur(3px)"} _hover={{ transition: "filter 0.2s ease-in" }} onMouseLeave={() => {
                                                                        setHover(false);
                                                                        setHoverId(null);
                                                                    }} />
                                                                    <Stack isInline pos="absolute" top="50%" left="50%" transform="translate(-50%,-50%)">
                                                                        <BiDownload fontSize={"48px"} filter='invert(100%)' />

                                                                        <Heading as="a" zIndex={5} filter='invert(100%)'>
                                                                            {" "} Download
                                                                        </Heading>
                                                                    </Stack>
                                                                </Box>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Image src={img.fields.file.url} alt={img.fields.title} border="1px" borderColor={"#242424"} rounded={"xl"} _hover={{ transition: "filter 0.2s ease-in" }} onMouseEnter={() => {
                                                                    setHover(true)
                                                                    setHoverId(img.fields.title)
                                                                }} />
                                                            </>
                                                        )}
                                                    </Box>
                                                </>
                                            )
                                        })}
                                    </SimpleGrid>
                                </>
                            )
                        })}
                    </Stack>
                </Stack>
            </PremiumContainer>
        </>
    );
}

const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getServerSideProps() {
    let data = await client.getEntries({
        content_type: "photoCollection",
        order: "sys.createdAt",
    });

    return {
        props: {
            images: data.items.reverse(),
        },
    };
}
