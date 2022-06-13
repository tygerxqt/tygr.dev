import { Stack, Heading, Divider, Text } from "@chakra-ui/react";
import { createClient } from "contentful";
import PremiumContainer from "../../components/Accounts/PremiumContainer";
import { useCallback, useState } from "react";
import Head from "next/head";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

export default function PhotographyPage({ images }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const imageArray = images[0].fields.images.map((img) => {
        return {
            src: img.fields.file.url,
            download: img.fields.file.url,
            width: img.fields.file.details.image.width,
            height: img.fields.file.details.image.height,
        };
    });

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
                                    <Gallery photos={imageArray} onClick={openLightbox} />
                                    <ModalGateway>
                                        {viewerIsOpen ? (
                                            <Modal onClose={closeLightbox}>
                                                <Carousel
                                                    currentIndex={currentImage}
                                                    views={imageArray}
                                                    styles={{
                                                        view: (base, state) => ({
                                                            ...base,
                                                            display: "flex ",
                                                            alignContent: "center",
                                                            justifyContent: "center",
                                                        })
                                                    }}
                                                />
                                            </Modal>
                                        ) : null}
                                    </ModalGateway>
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
