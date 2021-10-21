<template>
    <v-card :color="(scene && activated) ? 'blue lighten-5' : 'white'">
        <v-card-title class="pb-0">
            <v-container no-gutters class="mt-n5 pb-0">
            <v-row no-gutters align="center">
            <h2 v-if="!editing" class="vecna-font">{{scene.name}}</h2>
            <v-text-field 
                v-if="editing"
                v-model="internalScene.name"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-switch
                :value="activated"
                :loading="activating"
                :disabled="activating || editing"
                v-on:change="$event ? activate() : deactivate();"
            ></v-switch>
            </v-row>
            </v-container>
        </v-card-title>
        <v-card-text class="mt-n1">
            <v-container v-if="!editing">
                <v-fade-transition group class="row no-gutters" appear>
                    <v-col v-for="(stage, index) in scene.stages" v-bind:key="index">
                        <v-row no-gutters>
                        <v-sheet
                            :color="stage.getRGBAString()"
                            width="24"
                            height="24"
                            rounded="circle"
                        ></v-sheet>
                        </v-row>
                    </v-col>
                </v-fade-transition>
            </v-container>
            <v-container v-else>
                <v-row align="start" class="mb-n8">
                    <v-col cols="12">
                    <h3>Lights:</h3>
                    </v-col>
                    <v-col>
                    <v-slide-x-transition>
                    <v-select
                        :items="lights"
                        :menu-props="{ top: true, offsetY: true }"
                        dense
                        outlined
                        v-model="newLight"
                        :rules="[validation.lightAlreadyAdded]"
                        class="mt-n2"
                    ></v-select>
                    </v-slide-x-transition>
                    </v-col>
                    <v-col cols="2">
                    <v-btn
                        fab
                        small
                        class="mt-n2"
                        @click="addLight"
                    ><v-icon>mdi-plus</v-icon></v-btn>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col v-for="(light, index) in internalScene.lights" v-bind:key="light.index" cols="12" md="auto">
                        <p>{{light.name}}<v-btn text x-small color="red" @click="deleteLight(index)">X</v-btn></p>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-row no-gutters>
                            <h3>Stages:</h3>
                            <v-btn
                                fab
                                small
                                class="mt-n2 ml-2"
                                @click="addStage"
                            ><v-icon>mdi-plus</v-icon></v-btn>
                        </v-row>
                    </v-col>
                </v-row>
                <v-fade-transition group class="row no-gutters" mode="out-in" appear>
                    <v-col v-for="(stage, index) in internalScene.stages" v-bind:key="index">
  
                        <v-sheet
                            :color="stage.getRGBAString()"
                            :width="selectedStage == index ? 32 : 24"
                            :height="selectedStage == index ? 32 : 24"
                            rounded="circle"
                            @click="selectedStage = index"
                            :elevation="selectedStage == index ? 6 : 0"
                        ></v-sheet>
                    </v-col>
                </v-fade-transition>
                <v-row v-if="selectedStage > -1" width="350">
                    <v-col>
                        <v-row no-gutters >
                            <v-text-field
                            v-model="internalScene.stages[selectedStage].name"
                            dense
                            outlined
                            class="shrink"
                            style="width: 200px;"
                            ></v-text-field>
                            <v-btn
                                fab
                                small
                                class="mx-2"
                                @click="$delete(internalScene.stages,selectedStage); selectedStage = (internalScene.stages.length ? 0 : -1)"
                            ><v-icon>mdi-delete</v-icon></v-btn>
                        </v-row>
                        <v-row no-gutters>
                        <v-color-picker
                            dot-size="25"
                            mode="hsla"
                            hide-mode-switch
                            @update:color="internalScene.stages[selectedStage].setColor($event)"
                            :value="internalScene.stages[selectedStage].getHSLA()"
                            elevation=6
                        ></v-color-picker>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                            <h3 v-if="editing">Transition Time:</h3>
                            <v-range-slider
                                v-model="transitionRange"
                                min=1
                                max=120
                                step=1
                                thumb-label='always'
                                class="mt-10"
                                v-on:change="updateTransitionRange()"
                            ></v-range-slider>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-fab-transition>
            <v-btn
                color="green"
                fab
                small
                :loading="saving"
                v-if="editing"
                @click="save"
            ><v-icon>mdi-content-save</v-icon></v-btn>
            </v-fab-transition>
            <v-fab-transition>
            <v-btn
                fab
                small
                @click="toggleEditing"
                :disabled="saving"
            ><v-icon v-if="!editing">mdi-pencil</v-icon><v-icon v-else>mdi-cancel</v-icon></v-btn>
            </v-fab-transition>
            <v-fab-transition>
            <v-btn
                color="red"
                fab
                small
                :disabled="saving"
                @click="$emit('delete')"
            ><v-icon>mdi-delete</v-icon></v-btn>
            </v-fab-transition>
        </v-card-actions>
    </v-card>
</template>

<script>
import { ScenesService } from '../services/Scenes.service';
import Scene from '../types/Scene.type';
import Stage from '../types/Stage.type';

export default {
    name: 'SceneCard',

    props: {
        scene: {
            type: Scene,
            default: null
        },
        lights: {
            type: Array,
            default: () => []
        },
        activated: {
            type: Boolean,
            default: false
        }
    },

    watch: {
        scene: {
            handler: function() {
                this.internalScene = this.scene.clone();
                this.transitionRange = this.internalScene.transitionRange;
            },
            deep: true,
            immediate: true
        },
        activated: {
            handler: function() {
                if (this.activated) {
                    this.activating = false;
                }
            },
            immediate: true
        }
    },

    data: function() {
        return {
            saving: false,
            editing: false,
            activating: false,
            internalScene: new Scene(),
            newLight: null,
            transitionRange: [10,100],
            selectedStage: -1,
            validation: {
                minSize100: val => val >= 100 || 'Minimum of 100ms',
                lightAlreadyAdded: val => {if (val == null) return true; for (const light of this.internalScene.lights) {if (light.index == val.index) {return 'Light already added.';}} return true;}
            }
        }
    },

    methods: {
        save: function() {
            if (this.saving) return;
            this.saving = true;
            ScenesService.updateScene(this.internalScene).then(() => {
                this.$emit('save', this.internalScene);
                if (this.activated) {
                    this.$emit('deactivate');
                }
            })
            .catch((err) => {
                console.log(err);
            }).then(() => {
                this.saving = false;
                this.editing = false;
            });
        },
        cancelEditing: function() {
            this.editing = false;
            this.internalScene = this.scene.clone();
            this.transitionRange = this.internalScene.transitionRange;
            this.updateTransitionRange();
        },
        startEditing: function() {
            this.internalScene = this.scene.clone();
            this.editing = true;
            if (this.internalScene.stages && this.internalScene.stages.length) {
                this.selectedStage = 0;
            }
        },
        toggleEditing: function() {
            if (this.editing) {
                this.cancelEditing();
            }else{
                this.startEditing();
            }
        },
        addLight: function() {
            let found = false;
            for (const light of this.internalScene.lights) {
                if (light.index == this.newLight.index) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.internalScene.lights.push(this.newLight);
                this.$emit('add-light');
            }
        },
        deleteLight: function(index) {
            this.internalScene.lights.splice(index,1);
        },
        addStage: function() {
            this.internalScene.stages.push(new Stage());
            this.selectedStage = this.internalScene.stages.length - 1;
        },
        activate: function() {
            this.activating = true;
            this.$emit('activate');
        },
        deactivate: function() {
            this.$emit('deactivate');
        },
        updateTransitionRange: function() {
            this.internalScene.transitionRange = this.transitionRange;
        }
    }
}
</script>