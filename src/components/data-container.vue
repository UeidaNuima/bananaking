<template lang="html">
    <div>
        <mu-tabs :value="activeTab" @change="handleTabChange">
            <mu-tab value="result" title="结果"/>
            <mu-tab value="alternative" title="备选列表"/>
            <!-- <mu-tab value="history" title="历史"/> -->
        </mu-tabs>
        <div v-show="activeTab === 'alternative'">
            <mu-content-block>
                <mu-raised-button @click="deleteItems" :disabled="!selectedRows.length || editEnabled || addEnabled" label="删除" secondary/>
                <mu-raised-button :disabled="editEnabled" @click="addEnabled = !addEnabled" :label="addEnabled?'保存':'增加'" primary/>
                <mu-raised-button @click="editEnabled = !editEnabled" :disabled="selectedRows.length!=1 || addEnabled" :label="editEnabled?'保存':'编辑'" primary/>
            </mu-content-block>
            <mu-table @rowSelection="hanldeRowSelect" :enableSelectAll="options.length > 0 && !editEnabled" multiSelectable :selectable="!editEnabled">
                <mu-thead>
                    <mu-tr>
                        <mu-th>内容</mu-th>
                        <mu-th v-if="weightEnabled">权重</mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="item, index in options" :key="index + item.id">
                        <template v-if="!editEnabled || !(selectedRows.indexOf(index)!=-1)">
                            <mu-td>{{item.name}}</mu-td>
                            <mu-td v-if="weightEnabled">{{item.weight}}</mu-td>
                        </template>
                        <template v-if="editEnabled && selectedRows.indexOf(index)!=-1">
                            <mu-td>
                                <mu-text-field v-model="item.name" fullWidth/>
                            </mu-td>
                            <mu-td v-if="weightEnabled">
                                <mu-text-field v-model.number="item.weight" type="number" fullWidth/>
                            </mu-td>
                        </template>
                    </mu-tr>
                    <mu-tr v-if="addEnabled" :selectable="false">
                        <mu-td>
                            <mu-text-field v-model="addItem.name" fullWidth/>
                        </mu-td>
                        <mu-td v-if="weightEnabled">
                            <mu-text-field v-model.number="addItem.weight"  type="number" fullWidth/>
                        </mu-td>
                    </mu-tr>
                </mu-tbody>
            </mu-table>
        </div>
        <div v-show="activeTab === 'result'">
            <mu-list>
                <mu-list-item v-for="result, index in results" :title="result" :key="index">
                </mu-list-item>
            </mu-list>
        </div>
        <mu-toast v-if="toast" message="いいゾ～これ"/>
    </div>
</template>

<script>
import Bus from '../bus.js'
export default {
    data () {
        return {
            activeTab: 'alternative',
            selectedRows: [],
            options: this.initOptions,
            weightEnabled: this.initWeightEnabled,
            repeatEnabled: this.initRepeatEnabled,
            results: this.initResults,
            editEnabled: false,
            addEnabled: false,
            addItem:{
                name:'',
                weight: 1,
                id: Math.random()
            },
            toast: false
        }
    },
    computed: {
        focused: function(){
            return this.editEnabled || this.addEnabled;
        }
    },
    props: ['initRepeatEnabled', 'initWeightEnabled', 'initOptions', 'initResults'],
    methods: {
        handleTabChange(value) {
            this.activeTab = value;
        },
        hanldeRowSelect(selectedRowsIndex){
            // 被删掉的行依然会留在选择中，然而index是个-1，这tm是bug吧
            for(let i=0; i<selectedRowsIndex.length;i++)
                if(selectedRowsIndex[i] == -1){
                    selectedRowsIndex.splice(i, 1);
                }
            this.selectedRows = selectedRowsIndex;
        },
        chooseBananas(num) {
            this.results = [];
            let options = this.options.slice(0);
            for(let i = 0; i < num; i++){
                if(this.repeatEnabled){
                    this.results.push(this.chooseOneBanana(this.options).name);
                } else {
                    let item = this.chooseOneBanana(options);
                    this.results.push(item.name);
                    options.splice(item.index, 1);
                }
            }
            this.activeTab = 'result';
        },
        chooseOneBanana(options) {
            //粉香蕉不是绿茶: キモティカ
            //粉香蕉不是绿茶: モヘンジョ＝ダロ
            //粉香蕉不是绿茶: for iphone?
            //粉香蕉不是绿茶 撤回了三条消息
            let range = 0;
            options.forEach(option => {
                range += this.weightEnabled ? option.weight : 1;
            });
            let choice = Math.random() * range;
            let step = 0;
            let goal = null;
            for(let index = 0; index < options.length; index++){
                goal = index;
                step += this.weightEnabled ? options[index].weight : 1;
                if(step > choice) break;
            }
            return {
                index: goal,
                name: options[goal].name
            };
        },
        deleteItems() {
            if(confirm('ふっざけんな！やめろバカ！ﾎﾟｲﾃｰﾛ!')){
                for(let index = this.selectedRows.length - 1; index>=0; index--)
                    this.options.splice(this.selectedRows[index], 1);
                this.selectedRows = [];
            }
        },
        showToast() {
            this.toast = true;
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => { this.toast = false }, 2000);
        }
    },
    watch: {
        options: function(newValue, oldValue) {
            Bus.$emit('optionChanged', newValue);
        },
        addEnabled: function(newValue, oldValue) {
            if(newValue === false){
                if(this.addItem.name != ''){
                    this.options.push({
                        name: this.addItem.name,
                        weight: this.addItem.weight
                    });
                }
                this.addItem.name = '';
                this.addItem.weight = 1;
            }
        }
    },
    created: function () {
        Bus.$on('optionChanged', options => {
            this.options = options;
        }).$on('weightChanged', weightEnabled => {
            this.weightEnabled = weightEnabled;
        }).$on('repeatChanged', repeat => {
            this.repeatEnabled = repeat;
        }).$on('run', num => {
            this.chooseBananas(num);
        }).$on('saveState', () => {
            localStorage.options = JSON.stringify(this.options);
            localStorage.results = JSON.stringify(this.results);
            this.showToast();
        });
        for(let i=0; i<this.options.length; i++){
            if(!this.options[i]['id'])
                this.options[i]['id'] = Math.random();
        }
    }
}
</script>

<style lang="css">
</style>
