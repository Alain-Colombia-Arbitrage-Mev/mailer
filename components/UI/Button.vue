<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <div class="flex items-center justify-center">
      <!-- Loading spinner -->
      <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>

      <!-- Icon -->
      <component
        v-if="icon && !loading"
        :is="icon"
        :class="iconClasses"
      />

      <!-- Content -->
      <span v-if="$slots.default || label">
        <slot>{{ label }}</slot>
      </span>
    </div>
  </component>
</template>

<script setup lang="ts">
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: any
  iconPosition?: 'left' | 'right'
  tag?: string
  label?: string
  block?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  tag: 'button',
  block: false
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const baseClasses = [
  'inline-flex items-center justify-center font-medium transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'rounded-lg'
]

const variantClasses = {
  primary: [
    'bg-blue-600 text-white hover:bg-blue-700',
    'focus:ring-blue-500',
    'shadow-sm'
  ],
  secondary: [
    'bg-gray-100 text-gray-900 hover:bg-gray-200',
    'focus:ring-gray-500',
    'border border-gray-300'
  ],
  success: [
    'bg-green-600 text-white hover:bg-green-700',
    'focus:ring-green-500',
    'shadow-sm'
  ],
  danger: [
    'bg-red-600 text-white hover:bg-red-700',
    'focus:ring-red-500',
    'shadow-sm'
  ],
  warning: [
    'bg-yellow-600 text-white hover:bg-yellow-700',
    'focus:ring-yellow-500',
    'shadow-sm'
  ],
  info: [
    'bg-cyan-600 text-white hover:bg-cyan-700',
    'focus:ring-cyan-500',
    'shadow-sm'
  ],
  ghost: [
    'text-gray-700 hover:bg-gray-100',
    'focus:ring-gray-500'
  ]
}

const sizeClasses = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-base'
}

const buttonClasses = computed(() => [
  ...baseClasses,
  ...variantClasses[props.variant],
  sizeClasses[props.size],
  {
    'w-full': props.block,
    'cursor-not-allowed': props.disabled || props.loading
  }
])

const iconClasses = computed(() => {
  const baseIconClasses = ['flex-shrink-0']
  
  if (props.size === 'xs') {
    baseIconClasses.push('h-3 w-3')
  } else if (props.size === 'sm') {
    baseIconClasses.push('h-4 w-4')
  } else if (props.size === 'lg' || props.size === 'xl') {
    baseIconClasses.push('h-5 w-5')
  } else {
    baseIconClasses.push('h-4 w-4')
  }

  if (props.label || $slots.default) {
    if (props.iconPosition === 'left') {
      baseIconClasses.push('mr-2')
    } else {
      baseIconClasses.push('ml-2')
    }
  }

  return baseIconClasses
})
</script>

