import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import tw from "twin.macro";
import styled from "styled-components";
import axios from "axios";
import { css } from "styled-components/macro"; //eslint-disable-line
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import EmailIllustrationSrc from "images/email-illustration.svg";
import { Alert } from "theme-ui";
import { ThemeProvider } from "theme-ui";
import theme from "theme";
import { useGlobal } from "reactn";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`;
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`;

export default ({
  subheading = "Need an account?",
  heading = (
    <>
      <span tw="text-primary-500">Sign In</span>
    </>
  ),
  submitButtonText = "Sign In",
  textOnLeft = true,
}) => {
  // The textOnLeft boolean prop can be used to display either the text on left or right side of the image.

  const history = useHistory();
  const { handleSubmit, register, errors } = useForm();
  const [error, setError] = useState(false);
  const [token, setToken] = useGlobal("token");
  const [isAuthenticated, setIsAuthenticated] = useGlobal("isAuthenticated");

  const onSubmit = (values) => {
    axios
      .post("/api/auth", values)
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setIsAuthenticated(true);
        history.push("/test");
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };

  return (
    <div>
      <Container>
        <TwoColumn>
          {/* <ImageColumn>
            <Image imageSrc={EmailIllustrationSrc} />
          </ImageColumn> */}
          <TextColumn textOnLeft={textOnLeft}>
            <TextContent>
              <Heading>{heading}</Heading>
              {subheading && (
                <Link to="/signup">
                  <Subheading tw="text-primary-400">{subheading}</Subheading>
                </Link>
              )}
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  name="email"
                  placeholder="Email Address"
                  ref={register({
                    required: "Required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address.",
                    },
                  })}
                />
                {errors.email && errors.email.message}

                <Input
                  name="password"
                  placeholder="Password"
                  type="password"
                  ref={register({ required: true })}
                />
                {errors.password?.type === "required" &&
                  "A password is required."}

                <SubmitButton type="submit">{submitButtonText}</SubmitButton>
                {error && (
                  <ThemeProvider theme={theme}>
                    <Alert
                      sx={{
                        width: ["100%"],
                        marginTop: ["50px"],
                      }}
                    >
                      The email and/or password were incorrect.
                    </Alert>
                  </ThemeProvider>
                )}
              </Form>
            </TextContent>
          </TextColumn>
        </TwoColumn>
      </Container>
    </div>
  );
};
