<template lang="html">
    <div class="main">
        <mu-content-block>
            <mu-row>
                <mu-col width="33" tablet="15" desktop="15" class="repeat">
                    <mu-content-block>
                    <mu-switch class="reverse" @change="repeatChanged" v-model="repeatEnabled" label="允许重复"/>
                </mu-content-block>
                </mu-col>
                <mu-col width="66" tablet="75" desktop="75">
                    <mu-text-field class="reverse" ref="input" v-model.number="chooseNum" :label="'香蕉的条数。一共登陆了'+optionSum+'条'" hintText="抽选的条数" type="number" fullWidth />
                </mu-col>
            </mu-row>
            <mu-raised-button @click="run" :disabled="runDisabled" label="蕉" secondary/>
            <mu-raised-button label="上传列表">
                <input type="file" class="file-button" @change='fileHandle'>
            </mu-raised-button>
            <mu-raised-button @click="saveState" label="保存" />
            <mu-switch class="reverse btn" v-model="weightEnabled" label="权重" @change='weightHandle'/>
        </mu-content-block>
    </div>
</template>

<script>
import Bus from '../bus.js';
export default {
    data () {
        return {
            chooseNum: this.initChooseNum,
            optionSum: this.initOptionSum,
            weightEnabled: this.initWeightEnabled,
            repeatEnabled: this.initRepeatEnabled
        }
    },
    props: ['initChooseNum', 'initRepeatEnabled', 'initWeightEnabled', 'initOptionSum'],
    computed: {
        runDisabled: function() {
            if(this.optionSum <= 0) return true;
            if(this.chooseNum <= 0)  return true;
            if(!this.repeatEnabled && this.chooseNum > this.optionSum) return true;
            return false;
        }
    },
    methods: {
        weightHandle(value) {
            Bus.$emit('weightChanged', value);
        },
        fileHandle(ev) {
            let file = ev.target.files[0];
            let ext = '.txt';
            if(!/\.txt$/.test(file.name)) {
                alert('连txt都不是，真鸡儿丢人');
                return;
            }
            let reader = new FileReader();
            reader.readAsText(file, 'utf-8');
            reader.onload = (rev) => {
                let text = rev.target.result;
                let lines = text.split('\n');
                let result = [];
                lines.forEach((line) => {
                    line = line.split(',');
                    let name = line[0];
                    let weight = 1;
                    if(line.length > 1){
                        weight = Number(line[1]);
                        if(!weight || weight < 0)
                            weight = 1;
                    }
                    result.push({
                        name: name,
                        weight: weight,
                        id: Math.random()
                    });
                });
                Bus.$emit('optionChanged', result);
            };
        },
        run() {
            Bus.$emit('run', this.chooseNum);
        },
        repeatChanged(value) {
            Bus.$emit('repeatChanged', value);
        },
        saveState(){
            localStorage.weightEnabled =  this.weightEnabled;
            localStorage.repeatEnabled = this.repeatEnabled;
            localStorage.chooseNum = this.chooseNum;
            Bus.$emit('saveState');
        }
    },
    created: function() {
        Bus.$on('optionChanged', options => {
            this.optionSum = options.length;
        });
    }
}
</script>

<style lang="css">
    .main {
        background-color: #474a4f;
    }
    .reverse, .reverse * {
        color: white!important;
    }
    .repeat {
        margin-top: 10px;
    }
    .btn {
        margin: 10px!important;
    }
    .file-button {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
    }
</style>
