<template>
  <div id="app">
    <main class="main">
      <section class="row">
        <div class="column">
          <health-bar label="You" :level="youHealth"></health-bar>
        </div>
        <div class="column">
          <health-bar label="Monster" :level="monsterHealth" :automatic="true"></health-bar>
        </div>
      </section>
      <transition name="fade" mode="out-in">
        <section v-if="!running" class="controls" key="start">
          <button class="button button--start" @click="running = true">Start New Game</button>
        </section>
        <section v-else class="controls" key="controls">
          <button
            class="button button--attack"
            @click="attack(20, true)"
            :disabled="attackDisabled">
            Attack
          </button>
          <button
            class="button button--special-attack"
            @click="attack(40, true)"
            :disabled="attackDisabled">
            Special Attack
          </button>
          <button
            class="button button--heal"
            @click="heal"
            :disabled="youHealth >= 100 || healDisabled">
            Heal
          </button>
          <button class="button button--give-up" @click="reset">Give Up</button>
        </section>
      </transition>
      <section v-if="log.length" class="log">
        <ul>
          <li v-for="item in log" :key="item.text" :class="item.class">{{ item.text }}</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
  import HealthBar from '@/components/health-bar';

  export default {
    name: 'app',
    components: {
      HealthBar
    },
    data () {
      return {
        running: false,
        you: {
          health: 100
        },
        monster: {
          health: 100
        },
        healRate: 2500,
        healAmount: 10,
        attackDisabledTimeout: null,
        healDisabledTimeout: null,
        rechargeInterval: null,
        log: [],
        attackDisabled: false,
        healDisabled: false
      };
    },
    computed: {
      youHealth: {
        get () {
          const vm = this;

          return vm.you.health;
        },
        set (val) {
          const vm = this;
          const damagePoints = vm.you.health - val;

          if (vm.running && damagePoints > 0) {
            vm.addLogItem(`Monster hits Player for ${damagePoints}`, true);
          }

          if (val <= 0) {
            return vm.endGame(false);
          }

          /* Cap out at 100 */
          vm.you.health = Math.min(val, 100);
        }
      },
      monsterHealth: {
        get () {
          const vm = this;

          return vm.monster.health;
        },
        set (val) {
          const vm = this;
          const damagePoints = vm.monster.health - val;

          if (vm.running && damagePoints > 0) {
            vm.addLogItem(`Player hits Monster for ${damagePoints}`, false);
          }

          if (val <= 0) {
            return vm.endGame(true);
          }

          /* Cap out at 100 */
          vm.monster.health = Math.min(val, 100);
        }
      }
    },
    watch: {
      monsterHealth () {
        const vm = this;

        vm.stopAutoRecharge();

        if (vm.running) {
          setTimeout(vm.instantiateAutoRecharge, 500);
        }
      }
    },
    methods: {
      getRandomInRange (min, max) {
        /* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random */

        return Math.floor(Math.random() * (max - min)) + min;
      },
      coinToss () {
        /* https://coderwall.com/p/vcom6g/quick-coin-flip-heads-tails-function-in-javascript */

        return Math.floor(Math.random() * 2) === 0;
      },
      attack (potential, counterAttack) {
        const vm = this;
        const damagePoints = vm.getRandomInRange(potential / 2, potential);

        if (!vm.running) {
          return;
        }

        if (counterAttack) {
          vm.monsterHealth -= damagePoints;
          vm.pauseAttacks();

          if (vm.coinToss()) {
            vm.attack(10);
          }
        } else {
          vm.youHealth -= damagePoints;
        }
      },
      pauseAttacks () {
        const vm = this;

        clearTimeout(vm.attackDisabledTimeout);
        vm.attackDisabled = true;

        vm.attackDisabledTimeout = setTimeout(() => {
          vm.attackDisabled = false;
        }, (vm.healRate * 0.75));
      },
      heal () {
        const vm = this;

        vm.youHealth += vm.healAmount;
        vm.addLogItem(`Player heals himself for ${vm.healAmount}`, false);

        clearTimeout(vm.healDisabledTimeout);
        vm.healDisabled = true;

        vm.healDisabledTimeout = setTimeout(() => {
          vm.healDisabled = false;
        }, vm.healRate);
      },
      instantiateAutoRecharge () {
        const vm = this;

        vm.stopAutoRecharge();
        vm.rechargeInterval = setInterval(() => {
          if (vm.monsterHealth >= 100) {
            return vm.stopAutoRecharge();
          }

          vm.monsterHealth += vm.healAmount;
          vm.addLogItem(`Monster heals himself for ${vm.healAmount}`, true);
        }, vm.healRate);
      },
      stopAutoRecharge () {
        const vm = this;

        clearInterval(vm.rechargeInterval);
      },
      addLogItem (message, isMonster) {
        const vm = this;

        vm.log.push({
          text: message,
          class: isMonster ? 'monster-turn' : 'player-turn'
        });
      },
      endGame () {
        const vm = this;

        vm.reset();
      },
      reset () {
        const vm = this;

        vm.running = false;

        vm.log = [];
        clearTimeout(vm.attackDisabledTimeout);
        clearTimeout(vm.healDisabledTimeout);
        vm.stopAutoRecharge();

        vm.youHealth = 100;
        vm.monsterHealth = 100;
        vm.attackDisabled = false;
        vm.healDisabled = false;
      }
    }
  };
</script>

<style src="./assets/scss/global.scss" lang="scss"></style>
