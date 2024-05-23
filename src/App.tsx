import { ChakraProvider, Input, Heading, Flex, FormLabel, Text, Image, Box, Link } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import NetworkInformations from './NetworkInformations';

function validateIP(ip: string): boolean {
  const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
  return ipRegex.test(ip);
}

function validateCIDR(cidr: string): boolean {
  const cidrRegex = /^(?:[1-9]|[1-2]\d|3[0-2])$/;
  return cidrRegex.test(cidr);
}

function App() {
  const [networkIp, setNetworkIp] = useState<string>("")
  const [cidr, setCidr] = useState<string>("")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('network-ip')) {
      setNetworkIp(urlParams.get('network-ip')!)
    }

    if (urlParams.has('cidr')) {
      setCidr(urlParams.get('cidr')!)
    }
  }, [])

  const handleNetworkIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urlParams = new URLSearchParams(window.location.search);
    const newNetworkIp = e.target.value;

    urlParams.set('network-ip', newNetworkIp);
    setNetworkIp(newNetworkIp);

    window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
  }

  const handleCidrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urlParams = new URLSearchParams(window.location.search);
    const newCidr = e.target.value;

    urlParams.set('cidr', newCidr);
    setCidr(newCidr);

    window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
  }

  return (
    <ChakraProvider>
      <Box mx={{ base: 4, lg: "auto" }} width={{ base: "auto", lg: "62em" }} mt={2}>
        <Flex mb={4} alignItems='center' gap={5}>
          <Image src='azure.svg' height="5rem" />
          <Heading>Azure Network Calculator</Heading>
        </Flex>
        <Text>
          This is a simple network calculator to get information about a network IP and CIDR in Azure context.
        </Text>

        <Flex gap={2} mt={4}>
          <Flex
            flexDirection="column"
            flexBasis={0}
            flexGrow={1}>
            <FormLabel htmlFor='network-ip'>Network IP</FormLabel>
            <Input
              id='network-ip'
              value={networkIp}
              onChange={(e) => handleNetworkIpChange(e)}
              placeholder="Network IP" />
          </Flex>
          <Flex
            flexBasis="7rem"
            flexGrow={0}
            flexDirection="column">
            <FormLabel htmlFor='cidr'>CIDR</FormLabel>
            <Input
              id='cidr'
              value={cidr}
              onChange={(e) => handleCidrChange(e)}
              placeholder="CIDR" />
          </Flex>
        </Flex>

        {!networkIp || !cidr ? (
          <Text mt={4}>Start typing some network ip and cidr...</Text>
        ) : (
          validateIP(networkIp) && validateCIDR(cidr) ? (
            <Box mt={4}>
              <NetworkInformations networkIp={networkIp} cidr={cidr} />
            </Box>
          ) : (
            <Text mt={4} color="red">Please enter a valid IP and CIDR.</Text>
          )
        )}


        <Box mt={5} mb={2}>
          <Text textAlign="center" fontStyle="italic">Build by <Link color="blue" textDecor="underline" href='https://github.com/ewencodes'>@ewencodes</Link></Text>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App
