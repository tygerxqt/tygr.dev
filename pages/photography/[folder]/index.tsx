import { Stack, Heading, Divider, Text, SimpleGrid, Box, Image, Code } from "@chakra-ui/react";
import { createClient } from "contentful";
import PremiumContainer from "../../../components/Accounts/PremiumContainer";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PhotograhyFolder({ images }) {
    const router = useRouter();
    return (
        <>
            <PremiumContainer>
                <Stack spacing={10} my={["10vh", "10vh", "15vh", "15vh"]}>
                    <Stack spacing={5}>
                        <Heading fontSize={{ base: "4xl", md: "6xl" }}>Photograhy / {router.query.folder}</Heading>
                        <Divider />
                        <Text fontSize={{ base: "md", md: "lg" }}>
                            The full catalogue of images from my Photography libaray that are in the <Code>/{router.query.folder}</Code> directory.
                        </Text>
                    </Stack>
                    <Stack spacing={5}>
                        {images.map((item) => {
                            return (
                                <>
                                    <SimpleGrid key={item} columns={[1, 1, 2, 3]} spacing={5}>
                                        {item.fields.images.map((img) => {
                                            return (
                                                <>
                                                    <Link key={img.fields.title} href={`/photography/${images[0].fields.folder}/${img.fields.title}`} passHref>
                                                        <Box as="a">
                                                            <Image src={img.fields.file.url} alt={img.fields.title} border="1px" borderColor={"#242424"} rounded={"xl"} />
                                                        </Box>
                                                    </Link>
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

export async function getServerSideProps({ params }) {
    let data = await client.getEntries({
        content_type: "photoCollection",
        order: "sys.createdAt",
        "fields.folder": params.folder,
    });

    return {
        props: {
            images: data.items.reverse(),
        },
    };
}
