import styled from "@emotion/styled";
import { Stack } from "@chakra-ui/react";

const darkMode = styled(Stack)`
  &&& {
    padding-top: 24px;
    font-size: 16px;
    * {
      box-sizing: border-box;
      margin: 0;
    }
    * + :not(code) {
      margin-top: revert;
    }
    li {
      margin-top: 0 !important;
    }
    blockquote {
      padding: 16px;
      color: rgba(255, 255, 255, 1);
      border-left: 0.35em solid;
      border-color: #779ecb;
      background: #1f1e1d;
    }
    blockquote p {
      font-style: italic;
    }
    img {
      display: block;
      margin: auto;
    }
  }
`;

const lightMode = styled(Stack)`
  &&& {
    padding-top: 24px;
    font-size: 16px;
    * {
      box-sizing: border-box;
      margin: 0;
    }
    * + :not(code) {
      margin-top: revert;
    }
    li {
      margin-top: 0 !important;
    }
    blockquote {
      padding: 16px;
      color: rgba(0, 0, 0, 1);
      border-left: 0.35em solid;
      border-color: #779ecb;
      background: #f3f3f3;
    }
    blockquote p {
      font-style: italic;
    }
    img {
      display: block;
      margin: auto;
    }
  }
`;

const PostContainer = {
  dark: darkMode,
  light: lightMode,
};

export default PostContainer;
