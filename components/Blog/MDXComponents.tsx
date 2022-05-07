/* eslint-disable react/jsx-key */

import {
  Box,
  Code,
  Heading,
  Link,
  Text,
  Divider,
  useColorMode,
  Image,
  chakra,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Highlight, { defaultProps } from "prism-react-renderer";
import lightTheme from "prism-react-renderer/themes/vsLight";
import darkTheme from "prism-react-renderer/themes/vsDark";

const CustomLink = (props) => {
  const { colorMode } = useColorMode();
  const color = {
    light: "#5E81AC",
    dark: "#90CDF4",
  };

  const href = props.href;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <NextLink href={href} passHref>
        <Link color={color[colorMode]} {...props} />
      </NextLink>
    );
  }

  return <Link color={color[colorMode]} isExternal {...props} />;
};

const DocsHeading = (props) => (
  <Heading
    css={{
      scrollMarginTop: "100px",
      scrollSnapMargin: "100px", // Safari
      "&[id]": {
        pointerEvents: "none",
      },
      "&[id]:before": {
        display: "block",
        height: " 6rem",
        marginTop: "-6rem",
        visibility: "hidden",
        content: `""`,
      },
      "&[id]:hover a": { opacity: 1 },
    }}
    {...props}
    mb="1em"
    mt="2em"
  >
    <Box pointerEvents="auto">
      {props.children}
      {props.id && (
        <Box
          aria-label="anchor"
          as="a"
          color="blue.500"
          fontWeight="normal"
          outline="none"
          _focus={{
            opacity: 1,
            boxShadow: "outline",
          }}
          opacity="0"
          ml="0.375rem"
          href={`#${props.id}`}
        >
          #
        </Box>
      )}
    </Box>
  </Heading>
);

const Hr = () => {
  const { colorMode } = useColorMode();
  const borderColor = {
    light: "gray.200",
    dark: "gray.600",
  };

  return <Divider borderColor={borderColor[colorMode]} my={4} w="100%" />;
};

const Pre = (props) => {
  const { colorMode } = useColorMode();

  const className = props.children.props.className || "";
  const matches = className.match(/language-(?<lang>.*)/);
  const theme = colorMode === "light" ? lightTheme : darkTheme;
  return (
    <Highlight
      {...defaultProps}
      code={props.children.props.children}
      language={matches[1]}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <chakra.pre
          css={{
            textAlign: "left",
            margin: "1em 0",
            padding: "0.5em",
            border: "1px",
          }}
          className={className}
          style={style}
        >
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              <chakra.span
                css={{
                  display: "inline-block",
                  width: "2em",
                  userSelect: "none",
                  opacity: 0.5,
                  marginLeft: 10,
                }}
                {...getLineProps({ line, key: i })}
              >
                {i + 1}
              </chakra.span>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </chakra.pre>
      )}
    </Highlight>
  );
};

const MDXComponents = {
  h1: (props) => (
    <Heading as="h1" size="xl" my={4} color="displayColor" {...props} />
  ),
  h2: (props) => <DocsHeading as="h2" size="lg" fontWeight="bold" {...props} />,
  h3: (props) => <DocsHeading as="h3" size="md" fontWeight="bold" {...props} />,
  h4: (props) => <DocsHeading as="h4" size="sm" fontWeight="bold" {...props} />,
  h5: (props) => <DocsHeading as="h5" size="sm" fontWeight="bold" {...props} />,
  h6: (props) => <DocsHeading as="h6" size="xs" fontWeight="bold" {...props} />,
  img: (props) => (
    <Image
      width={600}
      height={300}
      placeholder="blur"
      layout="responsive"
      objectFit="contain"
      w="auto"
      h="auto"
      mx="auto"
      alt="image"
      {...props}
    />
  ),
  inlineCode: (props) => (
    <Code colorScheme={"blue"} fontSize="0.84em" {...props} />
  ),
  pre: (props) => Pre(props),
  br: (props) => <Box height="24px" {...props} />,
  hr: Hr,
  a: CustomLink,
  p: (props) => <Text as="p" mt={0} lineHeight="tall" {...props} />,
  ul: (props) => <Box as="ul" pt={2} pl={4} ml={2} {...props} />,
  ol: (props) => <Box as="ol" pt={2} pl={4} ml={2} {...props} />,
  li: (props) => <Box as="li" pb={1} {...props} />,
};

export { CustomLink };
export default MDXComponents;
