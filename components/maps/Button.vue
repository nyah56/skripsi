<template>
  <button
    class="custom-button"
    :class="buttonClass"
    @click="onClick"
    type="button"
  >
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'check', // Default icon from Font Awesome
    },
  },
  computed: {
    buttonClass() {
      return {
        'btn-primary': this.type === 'primary',
        'btn-secondary': this.type === 'secondary',
        'btn-disabled': this.type === 'disabled',
        'btn-custom': this.type === 'custom',
      };
    },
    iconClass() {
      return `fa-${this.icon}`;
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped>
.custom-button {
  /* Basic button styles */
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
}

.btn-primary {
  background-color: #fff;
  color: #5d87ff;
}

.btn-secondary {
  background-color: #fff;
  color: #333;
}
.btn-custom {
  background-color: #5d87ff;
  color: #fff;
}

.btn-disabled {
  background-color: #ccc;
  color: #888;
  cursor: not-allowed;
}

/* You can add more styles as needed */
</style>
