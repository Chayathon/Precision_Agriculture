'use client'

import React from 'react'
import { Card, CardHeader, CardBody, Heading, FormControl, FormLabel, Input, Button, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'

function Page() {
  return(
    <Stack className="w-[100vw] h-[100vh]">
        <Card className="m-auto w-1/3 drop-shadow-2xl bg-blend-darken">
            <CardHeader>
                <Heading size='lg'>Forgot Password</Heading>
            </CardHeader>
            <CardBody>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder='Email' size='md' />
                    <br /><br />
                    <Button colorScheme='blue' className='w-full'>Confirm</Button><br />
                    <Text>Back to <Link href='/' className='text-blue-500 hover:underline'>Login</Link></Text>
                </FormControl>
            </CardBody>
        </Card>
    </Stack>
  )
}

export default Page