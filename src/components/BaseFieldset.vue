<template>
  <fieldset>
    <slot></slot>
  </fieldset>
</template>

<script>
export default {
  name: 'BaseFieldset'
}
</script>

<style lang="scss">
$color0: rgb(0, 202, 202);
$color1: #42cbf8;
$color2: rgba(0, 10, 10, 0.5);
$color3: rgba(0, 112, 202, 0.3);
$color4: #0188ca;

fieldset {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  color: $color1;
  background: $color2;
  border: 1px solid $color1;
  border-radius: 8px;
  font: 15px/25px 'Roboto Mono', 'Inconsolata', monospace, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-shadow: $color3  2px  2px 10px,
              $color3 -2px -2px 10px,
              $color3  40px 0px 50px -50px inset,
              $color3 -40px 0px 50px -50px inset,
              $color4  0px -40px 50px -50px inset,
              $color4  0px  40px 50px -50px inset;
  overflow: hidden;
}
</style>