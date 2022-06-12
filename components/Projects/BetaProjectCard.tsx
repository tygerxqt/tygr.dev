import { ScaleFade, Stack, Tag, TagLabel, TagLeftIcon, Image, Text, Link, Divider, Box, useColorMode, Badge, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, ButtonGroup, Heading } from "@chakra-ui/react"
import { useState } from "react"
import { FaExternalLinkAlt, FaGithub, FaReact } from "react-icons/fa"
import { SiTypescript, SiJavascript, SiNextdotjs, SiElectron, SiCplusplus, SiCsharp } from "react-icons/si"
import { VscTerminalBash } from "react-icons/vsc"
import useMediaQuery from "../../hook/useMediaQuery"
import ProjectView from "./BetaProjectView"
import BetaView from "./BetaView"

export default function BetaProjectCard({
    title,
    description,
    image,
    githubLink,
    deployLink,
    tags,
    beta,
    published,
    archived,
    id,
    userData
}) {
    const getTag = (tag) => {
        let values = []
        switch (tag) {
            case 'TypeScript': {
                values[0] = 'blue'
                values[1] = SiTypescript
            }
                break;
            case 'JavaScript': {
                values[0] = 'yellow'
                values[1] = SiJavascript
            }
                break;
            case 'Bash': {
                values[0] = 'grey'
                values[1] = VscTerminalBash
            }
                break;
            case 'React': {
                values[0] = 'blue'
                values[1] = FaReact
            }
                break;
            case 'NextJS': {
                values[0] = 'grey'
                values[1] = SiNextdotjs
            }
                break;
            case 'Electron': {
                values[0] = 'white'
                values[1] = SiElectron
            }
                break;
            case 'C++': {
                values[0] = 'blue'
                values[1] = SiCplusplus
            }
                break;
            case 'C#': {
                values[0] = 'purple'
                values[1] = SiCsharp
            }
                break;
            default: {
                values[0] = 'white'
            }

        }
        return values
    }

    const isLargerThan800 = useMediaQuery(800);
    const isLargerThan480 = useMediaQuery(480);
    const { colorMode } = useColorMode();

    const [hover, setHover] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const Tags = tags.map((item) => (
        <Tag
            key={item}
            colorScheme={getTag(item)[0]}
            size={isLargerThan800 ? 'md' : 'sm'}
        >
            <TagLeftIcon as={getTag(item)[1]}></TagLeftIcon>
            <TagLabel>{item}</TagLabel>
        </Tag>
    ))

    return (
        <Stack
            borderRadius={"10px"}
            minH={"320px"}
            maxH={"500px"}
            border={"1px"}
            borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
        >
            <ScaleFade in={true}>
                <Box cursor={"pointer"} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onOpen}>
                    {hover ? (
                        <>
                            <Image
                                width={1250}
                                height={600}
                                w="auto"
                                h="auto"
                                src={image}
                                transition="filter 0.2s ease-in"
                                filter={"blur(2px)"}
                                placeholder="blur"
                                borderRadius="10px 10px 0px 0px"
                                alt="project image"
                            ></Image>
                        </>
                    ) : (
                        <>
                            <Image
                                width={1250}
                                height={600}
                                w="auto"
                                h="auto"
                                src={image}
                                transition="0.3s"
                                placeholder="blur"
                                borderRadius="10px 10px 0px 0px"
                                alt="project image"
                            ></Image>
                        </>
                    )}
                </Box>
                <Stack px={4} py={2}>
                    <Stack isInline justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontFamily="Ubuntu" fontSize={"2xl"}>
                            {title}
                            {beta === true ? (
                                <Badge colorScheme='blue' fontWeight={"thin"} variant="outline" ml="2">
                                    Beta
                                </Badge>
                            ) : <div />}
                            {published === false ? (
                                <Badge colorScheme='red' fontWeight={"thin"} variant="outline" ml="2">
                                    Private
                                </Badge>
                            ) : <div />}
                            {archived === true ? (
                                <Badge colorScheme='green' fontWeight={"thin"} variant="outline" ml="2">
                                    Archived
                                </Badge>
                            ) : <div />}
                        </Text>
                        <Stack
                            isInline
                            justifyContent={"flex-end"}
                            alignItems={"center"}
                            spacing={4}
                        >
                            {githubLink ? (
                                <Link
                                    href={githubLink}
                                    color={colorMode === "light" ? "black" : "white"}
                                    isExternal
                                >
                                    <FaGithub size={23} />
                                </Link>
                            ) : (
                                <div />
                            )}
                            {deployLink ? (
                                <Link
                                    href={deployLink}
                                    color={colorMode === "light" ? "black" : "white"}
                                    isExternal
                                >
                                    <FaExternalLinkAlt size={23} />
                                </Link>
                            ) : (
                                <div />
                            )}
                        </Stack>
                    </Stack>
                    {isLargerThan480 ? (
                        <Stack isInline>{Tags}</Stack>
                    ) : (
                        <Stack isInline>
                            <Box>
                                {Tags}
                            </Box>
                        </Stack>
                    )}
                    <Divider />
                    <Text fontSize={['sm', 'md']}>
                        {description}
                    </Text>
                </Stack>
            </ScaleFade>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Heading fontSize={['xl', '2xl']}>What would you like to do?</Heading>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing={4}>
                            <ProjectView
                                title={title}
                                description={description}
                                tags={Tags}
                                image={image}
                                deployLink={deployLink}
                                githubLink={githubLink}
                                beta={beta}
                                archived={archived}
                                published={published}
                                id={id}
                                userData={userData}
                            />
                            <BetaView
                                title={title}
                                image={image}
                                id={id}
                                userData={userData}
                            />
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    )
}