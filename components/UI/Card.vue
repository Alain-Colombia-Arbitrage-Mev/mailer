<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="$slots.header || title" :class="headerClasses">
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3 v-if="title" class="text-lg font-medium text-gray-900">
            {{ title }}
          </h3>
          <div v-if="$slots.actions" class="flex items-center space-x-2">
            <slot name="actions" />
          </div>
        </div>
      </slot>
    </div>

    <!-- Content -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface CardProps {
  title?: string
  variant?: 'default' | 'bordered' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  padding: 'md',
  rounded: 'lg',
  shadow: 'sm',
  hover: false
})

const baseClasses = [
  'bg-white',
  'transition-all duration-200'
]

const variantClasses = {
  default: [],
  bordered: ['border border-gray-200'],
  elevated: ['shadow-lg'],
  flat: ['shadow-none']
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl'
}

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
}

const cardClasses = computed(() => [
  ...baseClasses,
  ...variantClasses[props.variant],
  roundedClasses[props.rounded],
  shadowClasses[props.shadow],
  {
    'hover:shadow-md': props.hover && props.shadow !== 'none',
    'border border-gray-200': props.variant === 'default'
  }
])

const headerClasses = computed(() => {
  const classes = ['border-b border-gray-200']
  
  if (props.padding === 'sm') {
    classes.push('px-3 py-2')
  } else if (props.padding === 'lg') {
    classes.push('px-6 py-4')
  } else if (props.padding !== 'none') {
    classes.push('px-4 py-3')
  }
  
  return classes
})

const contentClasses = computed(() => {
  const classes = []
  
  if (props.padding === 'sm') {
    classes.push('p-3')
  } else if (props.padding === 'lg') {
    classes.push('p-6')
  } else if (props.padding !== 'none') {
    classes.push('p-4')
  }
  
  return classes
})

const footerClasses = computed(() => {
  const classes = ['border-t border-gray-200', 'bg-gray-50']
  
  if (props.padding === 'sm') {
    classes.push('px-3 py-2')
  } else if (props.padding === 'lg') {
    classes.push('px-6 py-4')
  } else if (props.padding !== 'none') {
    classes.push('px-4 py-3')
  }
  
  return classes
})
</script>

