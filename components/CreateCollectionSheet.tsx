import { useForm } from "react-hook-form"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet"
import { createCollectionSchema, createCollectionSchemaType } from "@/schema/CreateCollection"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { CollectionColor, CollectionColors } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { createCollection } from "@/actions/collection"
import { toast } from "./ui/use-toast"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

interface CreateCollectionSheetProps {
  isOpen: boolean
  handleOpenChange: (isOpen: boolean) => void
}
const CreateCollectionSheet: React.FC<CreateCollectionSheetProps> = ({
  isOpen,
  handleOpenChange
}) => {

  const form = useForm<createCollectionSchemaType>({
    defaultValues: {},
    resolver: zodResolver(createCollectionSchema)
  })

  const router = useRouter()

  const onSubmit = async(data: createCollectionSchemaType) => {
    try {
      await createCollection(data)

      openChangeWrapper(false)
      router.refresh()

      toast({
        title: 'Success',
        description: 'Collection created successfully!',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later',
        variant: 'destructive',
      })
      console.log('error while logging to the console', error);
      
    }
    
  }

  const openChangeWrapper = (isOpen: boolean) => {
    form.reset()
    handleOpenChange(isOpen)
  }

  return (
    <Sheet open={isOpen} onOpenChange={openChangeWrapper}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add new collection</SheetTitle>
          <SheetDescription>Collections are a way to group your tasks</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Personal' {...field} />
                  </FormControl>
                  <FormDescription>Collection name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger className={cn('w-full h-8 text-white', CollectionColors[field.value as CollectionColor])}>
                        <SelectValue placeholder='Color' className="w-full h-8"/>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(CollectionColors).map(color => (
                          <SelectItem
                            key={color}
                            value={color}
                            className={cn('w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-medium focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white focus:px-4 transition-all',
                              CollectionColors[color as CollectionColor]
                            )}
                          >
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select a color for your collection</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex flex-col gap-3 mt-4">
          <Separator />
          <Button
            disabled={form.formState.isSubmitting}
            variant={'outline'}
            onClick={form.handleSubmit(onSubmit)}
            className={cn(
              form.watch('color') && CollectionColors[form.getValues('color') as CollectionColor]
            )}
          >
            Confirm
            {form.formState.isSubmitting && (
              <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CreateCollectionSheet