import { Stack, Heading, Divider, Text } from "@chakra-ui/react";
import { createClient } from "contentful";
import PremiumContainer from "../../components/Accounts/PremiumContainer";
import Head from "next/head";
import ImageCard from "../../components/Accounts/Photography/ImageCard";


export default function PhotographyPage({ images }) {
    const folderArray = [];

    images.map((item) => {
        folderArray.push({ "folder": item.fields.folder, "images": item.fields.images });
    });

    return (
        <>
            <PremiumContainer>
                <Head>
                    <title>Photography</title>
                </Head>
                <Stack spacing={10} my={["10vh", "10vh", "15vh", "15vh"]}>
                    <Stack spacing={5}>
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Photography</Heading>
                        <Divider />
                        <Text fontSize={{ base: "md", md: "lg" }}>
                            The full catalogue of images from my Photography libaray. You are able to use these images in your projects.
                        </Text>
                    </Stack>
                    <Stack spacing={5}>
                        {folderArray.map((item) => {
                            return (
                                <>
                                    <ImageCard folder={item.folder} images={item.images} />
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
