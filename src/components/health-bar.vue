<template>
  <div class="healthbar">
    <h1 v-if="label" class="healthbar__label">{{ label }}</h1>
    <div class="healthbar__bar">
      <div class="healthbar__fill" :style="barStyle">
        <transition name="fade" mode="out-in">
          <span v-show="levelVisible">{{ level }}</span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: String,
      level: {
        type: Number,
        default: 100
      },
      total: {
        type: Number,
        default: 100
      },
      automatic: Boolean
    },
    data () {
      return {
        barColors: [
          {
            style: {
              backgroundColor: 'red',
              color: '#fff'
            },
            min: 1
          },
          {
            style: {
              backgroundColor: 'yellow',
              color: '#000'
            },
            min: 20
          },
          {
            style: {
              backgroundColor: 'green',
              color: '#fff'
            },
            min: 50
          }
        ],
        timeout: null,
        levelVisible: false
      };
    },
    computed: {
      barWidth () {
        const vm = this;

        return Math.round((vm.level / vm.total) * 100);
      },
      barColor () {
        const vm = this;
        const possibleColors = vm.barColors.filter(item => item.min < vm.level);
        const finalColorItem = possibleColors[possibleColors.length - 1];

        // Take only the last item
        return finalColorItem ? finalColorItem.style : {
          backgroundColor: 'transparent'
        };
      },
      barStyle () {
        const vm = this;

        return Object.assign({}, vm.barColor, {
          width: `${vm.barWidth}%`
        });
      }
    },
    watch: {
      level () {
        const vm = this;

        vm.levelVisible = true;
        clearTimeout(vm.timeout);

        vm.timeout = setTimeout(() => {
          vm.levelVisible = false;
        }, 1000);
      }
    }
  };
</script>

<style lang="scss" scoped>
  $bar-height: 40px;

  .healthbar {
    padding: 1.34em 0 0;
    text-align: center;

    &__label {
      font-size: 2em;
      font-weight: 700;
      margin: 0 0 .67em;
      text-transform: uppercase;
    }

    &__bar {
      background-color: #eee;
    }

    &__fill {
      color: #fff;
      height: $bar-height;
      line-height: $bar-height;
      transition: 500ms ease;
      transition-property: background-color, width;
    }
  }
</style>
