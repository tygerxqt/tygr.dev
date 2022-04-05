import { chakra } from "@chakra-ui/react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from 'prism-react-renderer/themes/dracula';

const SyntaxHighlighter = ({ children }) => {
  const code = children.props.children;
  const language = children.props.className?.replace("language-", "").trim();

  return (
    <chakra.div position={"relative"} marginTop={"48px"} marginBottom={"60px"}>
        <chakra.pre 
            fontSize={"18px"} 
            outlineOffset={"2px"} 
            overflowX={"auto"} 
            marginLeft={"-32px"} 
            marginRight={"-32px"} 
            padding={"32px"} 
            minHeight={"50px"} 
            border={"1px solid rgba(230, 230, 230, 1)"} 
            borderBottomLeftRadius={"6px"} 
            borderBottomRightRadius={"6px"} 
            maxWidth={"calc(100% + 64px)"}
        >
            <Highlight {...defaultProps} code={code} language={language} theme={dracula}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={{ ...style }}>
                {tokens.slice(0, -1).map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                    ))}
                    </div>
                ))}
                </pre>
            )}
            </Highlight>
        </chakra.pre>
    </chakra.div>
  );
};

export default SyntaxHighlighter;