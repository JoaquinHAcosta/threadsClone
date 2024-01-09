"use client"

import { useForm } from 'react-hook-form'
import { 
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { usePathname, useRouter } from 'next/navigation'
import { useOrganization } from '@clerk/nextjs'

import { ThreadValidation } from '@/lib/validations/threads'
import { createThread } from '@/lib/actions/thread.actions'

interface Props {
    userId: string;
}

function PostThread({ userId }: Props ) {
    const router = useRouter()
    const pathname = usePathname()
    const { organization } = useOrganization()
    console.log(organization);
    
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
            await createThread({
                text: values.thread,
                author: userId,
                communityId: organization ? organization.id : null, 
                path: pathname
            })
        

        router.push('/')
    }

    return (
        <Form {...form}>
            <form
            className='mt-10 flex flex-col justify-start gap-10'
            onSubmit={form.handleSubmit(onSubmit)}>

                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                    <FormLabel className='text-base-semibold text-light-2'>
                        Content 
                    </FormLabel>
                    <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                        <Textarea 
                            rows={15}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type='submit' className='bg-primary-500'>
                    Post Thread
                </Button>
            </form>
        </Form>
    )
}

export default PostThread