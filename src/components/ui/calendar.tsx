import * as React from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {  DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import {  buttonVariants } from '@/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2 relative',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'absolute left-0 flex w-full justify-between z-1',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        month_grid: 'w-full border-collapse space-x-1',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100',
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent'
        ),
        range_start: 'aria-selected:bg-primary aria-selected:text-primary-foreground rounded-l-md',
        range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        range_end: 'aria-selected:bg-primary aria-selected:text-primary-foreground rounded-r-md',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-none',
        today: 'bg-accent text-accent-foreground',
        outside: 'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          switch (orientation) {
            case 'left':
              return <ChevronLeftIcon className="h-4 w-4" {...props} />;
            case 'right':
              return <ChevronRightIcon className="h-4 w-4" {...props} />;

            case 'down':
              return <ChevronDownIcon className="h-4 w-4" {...props} />;
            default:
              return <></>;
          }
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
