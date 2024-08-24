export const appearance = {
  theme: 'stripe',
  variables: {
    fontFamily: 'Roboto, sans-serif',
  },
  rules: {
    '.Label': {
      fontWeight: '500',
    },
    '.Input--invalid': {
      color: 'tomato',
    },
    '.Input:disabled, .Input--invalid:disabled': {
      color: 'lightgray',
    },
    '.Tab': {
      borderRadius: '4px',
    },
    '.Input': {
      borderRadius: '4px',
    },
    '.Error': {
      color: 'tomato',
    },
  },
};
