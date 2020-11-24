import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { graphql } from "gatsby"
import makeBlockie from "ethereum-blockies-base64"
import { Twemoji } from "react-emoji-render" // TODO replace

import Breadcrumbs from "../../components/Breadcrumbs"
import ButtonLink from "../../components/ButtonLink"
import CardList from "../../components/CardList"
import Checkbox from "../../components/Checkbox"
import CopyToClipboard from "../../components/CopyToClipboard"
import Link from "../../components/Link"
import PageMetadata from "../../components/PageMetadata"
import Tooltip from "../../components/Tooltip"
import Warning from "../../components/Warning"

import {
  ButtonSecondary,
  FakeLink,
} from "../../components/SharedStyledComponents"
import { DEPOSIT_CONTRACT_ADDRESS } from "../../data/addresses.js"

const Page = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  @media (max-width: ${(props) => props.theme.breakpoints.l}) {
    flex-direction: column;
  }
`

const LeftColumn = styled.div`
  flex: 1 1 50%;
  padding: 2rem;
  padding-top: 5rem;
`

const RightColumn = styled(LeftColumn)`
  flex: 1 1 50%;
  padding-top: 8.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.l}) {
    padding-top: 1rem;
  }
`

const Title = styled.h1`
  font-weight: normal;
  font-size: 2rem;
  font-weight: 700;
  line-height: 140%;
  color: ${(props) => props.theme.colors.text};
`

const Subtitle = styled.div`
  font-size: 20px;
  line-height: 140%;
  color: ${(props) => props.theme.colors.text200};
  margin-bottom: 3.5rem;
`

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.breakpoints.m}) {
    flex-direction: column-reverse;
    align-items: flex-start;
    justify-content: flex-start;
  }
`

const StyledButton = styled(ButtonLink)`
  margin-top: 0rem;
  margin-bottom: 3rem;
`

const CardTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: ${(props) => props.theme.colors.primary};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.buttonColor};
  border-radius: 3px 3px 0px 0px;
  text-transform: uppercase;
  font-size: 14px;
`

const AddressCard = styled.div`
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  box-shadow: ${(props) => props.theme.colors.tableBoxShadow};
  margin-bottom: 2rem;
  max-width: 560px;

  @media (max-width: ${(props) => props.theme.breakpoints.l}) {
    max-width: 100%;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.l}) {
    position: sticky;
    top: 7.25rem; /* account for navbar */
  }
`

const Address = styled.div`
  font-family: "SFMono-Regular", monospace;
  border-radius: 2px;
  font-size: 2rem;
  flex-wrap: wrap;
  text-transform: uppercase;
  line-height: 140%;
  margin-bottom: 1rem;
`

const CopyButton = styled(ButtonSecondary)`
  margin-top: 0rem;
  margin-right: 1.5rem;
  @media (max-width: ${(props) => props.theme.breakpoints.m}) {
    margin-right: 0rem;
    margin-top: 1rem;
  }
`

const CardContainer = styled.div`
  margin: 2rem;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  @media (max-width: ${(props) => props.theme.breakpoints.m}) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
  }
`

const TitleText = styled.div``

const CardTitle = styled.h2`
  margin-top: 0rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const Caption = styled.div`
  color: ${(props) => props.theme.colors.text200};
  font-weight: 400;
  font-size: 14px;
  @media (max-width: ${(props) => props.theme.breakpoints.m}) {
    margin-bottom: 2rem;
  }
`

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  min-height: 3.5rem;
  margin-bottom: 0.5rem;

  .styled-checkbox {
    margin-top: 0.25rem;
  }
`

const Blockie = styled.img`
  border-radius: 4px;
  height: 4rem;
  width: 4rem;
`

const TextToSpeech = styled.div`
  display: flex;
  margin-bottom: 2rem;
`

const StyledFakeLink = styled(FakeLink)`
  margin-right: 0.5rem;
`

const StyledWarning = styled(Warning)`
  margin-top: 2rem;
`

const CHUNKED_ADDRESS = DEPOSIT_CONTRACT_ADDRESS.match(/.{1,3}/g).join(" ")

const blockieSrc = makeBlockie(DEPOSIT_CONTRACT_ADDRESS)

const DepositContractPage = ({ data, location }) => {
  const [state, setState] = useState({
    browserHasTextToSpeechSupport: false,
    textToSpeechRequest: undefined,
    isSpeechActive: false,
    showAddress: false,
    userHasUsedLaunchpad: false,
    userUnderstandsStaking: false,
    userWillCheckOtherSources: false,
  })

  useEffect(() => {
    const browserHasTextToSpeechSupport = !!window.speechSynthesis
    if (!browserHasTextToSpeechSupport) {
      return
    }
    // Create textToSpeechRequest
    let speech = new SpeechSynthesisUtterance()
    speech.lang = "en-US"
    speech.text = DEPOSIT_CONTRACT_ADDRESS.split("").join(" ")
    speech.volume = 1
    speech.rate = 0.5
    speech.pitch = 1
    // Add event listeners
    // Explicity set state in listener callback
    const speechCallbackState = {
      browserHasTextToSpeechSupport: true,
      textToSpeechRequest: speech,
      showAddress: true,
      userHasUsedLaunchpad: true,
      userUnderstandsStaking: true,
      userWillCheckOtherSources: true,
    }
    const onStartCallback = () =>
      setState({ ...speechCallbackState, isSpeechActive: true })
    const onEndCallback = () =>
      setState({ ...speechCallbackState, isSpeechActive: false })
    speech.addEventListener("start", onStartCallback)
    speech.addEventListener("end", onEndCallback)

    setState({
      ...state,
      browserHasTextToSpeechSupport,
      textToSpeechRequest: speech,
    })
    return () => {
      speech.removeEventListener("start", onStartCallback)
      speech.removeEventListener("end", onEndCallback)
      window.speechSynthesis.cancel()
    }
  }, [])

  const handleTextToSpeech = () => {
    if (!window.speechSynthesis) {
      console.error(
        "Browser doesn't support the 'SpeechSynthesis' text-to-speech API"
      )
      return
    }
    if (state.isSpeechActive) {
      window.speechSynthesis.cancel()
    } else {
      window.speechSynthesis.speak(state.textToSpeechRequest)
    }
  }

  const addressSources = [
    {
      title: "ConsenSys",
      link:
        "https://consensys.net/blog/news/eth2-phase-0-deposit-contract-address/",
      image: data.consensys.childImageSharp.fixed,
    },
    {
      title: "Ethereum Foundation",
      link: "https://blog.ethereum.org/2020/11/04/eth2-quick-update-no-19/",
      image: data.ef.childImageSharp.fixed,
    },
    {
      title: "Etherscan",
      link: `https://etherscan.io/address/${DEPOSIT_CONTRACT_ADDRESS}`,
      image: data.etherscan.childImageSharp.fixed,
    },
    {
      title: "EthHub",
      link:
        "https://docs.ethhub.io/ethereum-roadmap/ethereum-2.0/deposit-contract/",
      image: data.ethhub.childImageSharp.fixed,
    },
  ]

  const isButtonEnabled =
    state.userHasUsedLaunchpad &&
    state.userUnderstandsStaking &&
    state.userWillCheckOtherSources

  const textToSpeechText = state.isSpeechActive
    ? "Stop reading"
    : "Read address aloud"
  const textToSpeechEmoji = state.isSpeechActive
    ? ":speaker_high_volume:"
    : ":speaker:"
  return (
    <Page>
      <PageMetadata
        title="Eth2 deposit contract address"
        description="Verify the deposit contract address for Eth2 staking."
      />
      <LeftColumn>
        <Breadcrumbs slug={location.pathname} startDepth={1} />
        <Title>Get the deposit contract address</Title>
        <Subtitle>
          This is the address for the Eth2 staking contract. Use this page to confirm you’re sending funds to the correct address when you stake..
        </Subtitle>
        <h2>This is where you place your stake</h2>
        <p>
          To put your ETH in Eth2, you must use a special address to launch and follow the instructions. Sending ETH to the address on this page will make you a Staker.{" "}
          <Link to="/en/eth2/staking/">More on staking</Link>
        </p>
        <StyledButton to="https://launchpad.ethereum.org">
          Stake using launchpad
        </StyledButton>
       
   
      </LeftColumn>
      <RightColumn>
        <AddressCard>
          <CardTag>Get deposit contract address</CardTag>
          <CardContainer>
            {!state.showAddress && (
              <>
                <Row>
                  <CardTitle>Confirm to reveal address</CardTitle>
                </Row>
                <StyledCheckbox
                  size={1.5}
                  checked={state.userHasUsedLaunchpad}
                  callback={() =>
                    setState({
                      ...state,
                      userHasUsedLaunchpad: !state.userHasUsedLaunchpad,
                    })
                  }
                >
                  I read about the responsibility of the validator
                </StyledCheckbox>
                <StyledCheckbox
                  size={1.5}
                  checked={state.userUnderstandsStaking}
                  callback={() =>
                    setState({
                      ...state,
                      userUnderstandsStaking: !state.userUnderstandsStaking,
                    })
                  }
                >
                  I read about the responsibilities of a validator
                </StyledCheckbox>
                <StyledCheckbox
                  size={1.5}
                  checked={state.userWillCheckOtherSources}
                  callback={() =>
                    setState({
                      ...state,
                      userWillCheckOtherSources: !state.userWillCheckOtherSources,
                    })
                  }
                >
                  I will be responsible for the responsibilities assigned to me by the Ethereum network
                  sources.
                </StyledCheckbox>
                <CopyButton
                  disabled={!isButtonEnabled}
                  onClick={() =>
                    setState({ ...state, showAddress: !state.showAddress })
                  }
                >
                  <Twemoji svg text=":eyes:" /> Reveal address
                </CopyButton>
              </>
            )}
            {state.showAddress && (
              <>
                <Row>
                  <TitleText>
                    <CardTitle>Eth2 deposit contract address</CardTitle>
                    <Caption>
                      We've added spaces to make the address easier to read
                    </Caption>
                  </TitleText>
                  <Blockie src={blockieSrc} />
                </Row>
                {state.browserHasTextToSpeechSupport && (
                  <TextToSpeech>
                    <StyledFakeLink onClick={handleTextToSpeech}>
                      {textToSpeechText}
                    </StyledFakeLink>{" "}
                    <Twemoji svg text={textToSpeechEmoji} />
                  </TextToSpeech>
                )}
                <Tooltip content="Check each character carefully.">
                  <Address>{CHUNKED_ADDRESS}</Address>
                </Tooltip>
                <ButtonRow>
                  <CopyToClipboard text={DEPOSIT_CONTRACT_ADDRESS}>
                    {(isCopied) => (
                      <CopyButton>
                        {!isCopied ? (
                          <div>
                            <Twemoji svg text=":clipboard:" /> Copy address
                          </div>
                        ) : (
                          <div>
                            <Twemoji svg text=":white_check_mark:" /> Copied
                            address
                          </div>
                        )}
                      </CopyButton>
                    )}
                  </CopyToClipboard>
                  
                </ButtonRow>
              </>
            )}
            <StyledWarning emoji=":warning:">
              <div>
                Sending funds to this address make you a
                staker. 
              </div>
            </StyledWarning>
          </CardContainer>
        </AddressCard>
      </RightColumn>
    </Page>
  )
}

export default DepositContractPage

export const sourceImage = graphql`
  fragment sourceImage on File {
    childImageSharp {
      fixed(height: 20) {
        ...GatsbyImageSharpFixed
      }
    }
  }
`

export const query = graphql`
  query {
    consensys: file(relativePath: { eq: "projects/consensys.png" }) {
      ...sourceImage
    }
    ef: file(relativePath: { eq: "eth2-staking/ef-blog-logo.png" }) {
      ...sourceImage
    }
    ethhub: file(relativePath: { eq: "projects/ethhub.png" }) {
      ...sourceImage
    }
    etherscan: file(
      relativePath: { eq: "projects/etherscan-logo-circle.png" }
    ) {
      ...sourceImage
    }
  }
`
