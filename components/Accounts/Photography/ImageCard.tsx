import { Box, Image } from "@chakra-ui/react";
import Link from "next/link";

export default function ImageCard({ folder, url, image }) {
    return (
        <>
            <Link key={image.fields.title} href={`/photography/${folder}/${url}`} passHref>
                <Box key={image.fields.title} as="a" border="1px" borderColor={"#242424"} rounded={"xl"}>
                    <Image src={image.fields.file.url} alt={image.fields.file.fileName} rounded={"xl"} />
                </Box>
            </Link>
        </>
    )
}