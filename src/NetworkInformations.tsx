import { Flex, Heading, Link, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react'
import React, { useMemo } from 'react'

interface NetworkInformationsProps {
    networkIp: string
    cidr: string
}

const NetworkInformations: React.FC<NetworkInformationsProps> = ({ networkIp, cidr }) => {
    const binaryIp = useMemo(() => {
        const ipParts = networkIp.split('.');
        return ipParts
            .map((part) => parseInt(part).toString(2).padStart(8, '0'))
            .join('')
    }, [networkIp])

    const parsedNetworkIp = useMemo(() => {
        const parsedCidr = parseInt(cidr);
        const networkPrefix = binaryIp.slice(0, parsedCidr);

        const binaryFirstIp = networkPrefix.padEnd(32, '0');
        console.log(binaryFirstIp.match(/.{8}/g)!.map((part) => parseInt(part, 2)))
        return binaryFirstIp.match(/.{8}/g)!.map((part) => parseInt(part, 2));
    }, [binaryIp, cidr])

    const broadcastIp = useMemo(() => {
        const parsedCidr = parseInt(cidr);
        const networkPrefix = binaryIp.slice(0, parsedCidr);

        const binaryLastIp = networkPrefix.padEnd(32, '1');
        return binaryLastIp.match(/.{8}/g)!.map((part) => parseInt(part, 2));
    }, [binaryIp, cidr])

    const azureGatewayIp = useMemo(() => {
        const tempParsedNetworkIp = [...parsedNetworkIp]

        const lastDigit = tempParsedNetworkIp[3]
        tempParsedNetworkIp.pop();
        return [...tempParsedNetworkIp, lastDigit + 1]
    }, [parsedNetworkIp])

    const azureDNSIPs = useMemo(() => {
        const tempParsedNetworkIp = [...parsedNetworkIp]

        const lastDigit = tempParsedNetworkIp[3]
        tempParsedNetworkIp.pop();
        return [[...tempParsedNetworkIp, lastDigit + 2], [...tempParsedNetworkIp, lastDigit + 3]]
    }, [parsedNetworkIp])

    const firstAzureUsableIp = useMemo(() => {
        const tempParsedNetworkIp = [...parsedNetworkIp]

        const lastDigit = tempParsedNetworkIp[3]
        tempParsedNetworkIp.pop();
        return [...tempParsedNetworkIp, lastDigit + 4]
    }, [parsedNetworkIp])

    const lastAzureUsableIp = useMemo(() => {
        const tempBroadcastIp = [...broadcastIp]

        const lastDigit = tempBroadcastIp[3]
        tempBroadcastIp.pop();
        return [...tempBroadcastIp, lastDigit - 1]
    }, [broadcastIp])

    const numberOfIps = useMemo(() => {
        const parsedCidr = parseInt(cidr);

        return Math.pow(2, 32 - parsedCidr);
    }, [cidr])

    const numberOfUsableIps = useMemo(() => {
        return numberOfIps - 2;
    }, [numberOfIps])

    const numberOfUsableIpsOnAzure = useMemo(() => {
        return numberOfUsableIps - 3;
    }, [numberOfUsableIps])

    return (
        <Flex flexDirection="column">
            <Heading size="md" mb={2} textTransform="uppercase">Global network informations</Heading>
            <Text>
                This is applies for general network not in Azure.
            </Text>
            <Table>
                <Tbody>
                    <Tr>
                        <Td width="50%" textAlign="right"><strong>CIDR Notation</strong></Td>
                        <Td>{parsedNetworkIp.join(".")}/{cidr}</Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="right"><strong>Network IP (and first IP)</strong></Td>
                        <Td>{parsedNetworkIp.join(".")}</Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="right"><strong>Broadcast IP (and last IP)</strong></Td>
                        <Td>{broadcastIp.join(".")}</Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="right"><strong>Total number of IPs</strong></Td>
                        <Td>{numberOfIps}</Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="right"><strong>Total number of usable IPs</strong></Td>
                        <Td>{numberOfUsableIps}</Td>
                    </Tr>
                </Tbody>
            </Table>
            <Heading size="md" mb={2} mt={5} textTransform="uppercase">Azure network informations</Heading>
            <Text>
                This is applies <strong>only</strong> for Azure.
            </Text>
            <Text>
                Sources for reserved IPs: <Link color="blue" textDecor="underline" href='https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets'>Azure Virtual Network FAQ</Link>
            </Text>

            <Table>
                <Tbody>
                    <Tr>
                        <Td width="50%" textAlign="right"><strong>First Azure usable IP</strong></Td>
                        <Td>{firstAzureUsableIp.join(".")}</Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="right"><strong>Last Azure usable IP</strong></Td>
                        <Td>{lastAzureUsableIp.join(".")}</Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="right"><strong>Number of usable IPs on Azure</strong></Td>
                        <Td>{numberOfUsableIpsOnAzure}</Td>
                    </Tr>
                    <Tr>
                        <Td textAlign="right"><strong>Reserved IPs</strong></Td>
                        <Td lineHeight="1.5rem">
                            <Text>Default gateway : {azureGatewayIp.join(".")}</Text>
                            <Text>Mapped Azure DNS IP : {azureDNSIPs[0].join(".")}</Text>
                            <Text>Mapped Azure DNS IP : {azureDNSIPs[1].join(".")}</Text>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Flex>
    )
}

export default NetworkInformations