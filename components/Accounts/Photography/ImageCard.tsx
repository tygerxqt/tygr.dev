import { Box, Divider, Heading } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

export default function ImageCard({ folder, images }) {
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

    const imgArray = [];

    images.map((item) => {
        imgArray.push({
            src: "https:" + item.fields.file.url,
            download: "https:" + item.fields.file.url,
            width: item.fields.file.details.image.width,
            height: item.fields.file.details.image.height,
        });
    });

    return (
        <>
            <Heading fontSize={{ base: "2xl", md: "4xl" }} pt={"3vh"}>{folder[0].toUpperCase() + folder.slice(1)}</Heading>
            <Divider />
            <Gallery photos={imgArray} onClick={openLightbox} />
            <ModalGateway>
                {viewerIsOpen ? (
                    <Modal onClose={closeLightbox}>
                        <Carousel
                            currentIndex={currentImage}
                            views={imgArray}
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
}