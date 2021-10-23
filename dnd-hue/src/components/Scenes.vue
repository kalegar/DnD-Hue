<template>
    <v-container>
        <v-row>
            <h1 class="vecna-font">Scenes</h1>
            <v-dialog
                v-model="createSceneDialog"
                persistent
                max-width="600px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        fab
                        class="mx-2 mt-n1"
                        v-bind="attrs"
                        v-on="on"
                    ><v-icon>mdi-plus</v-icon></v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="text-h4">Create Scene</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="newScene.name"
                                        label="Scene Name"
                                        required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="createSceneDialog = false; resetNewScene()"
                        >Cancel</v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="createScene()"
                        >Create</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <v-row>
            <v-col v-for="(scene) in scenes" v-bind:key="scene.name" cols="12" md="6">
                <scene-card v-on:delete="confirmDeleteScene(scene)" v-on:save="Object.assign(scene,$event.clone());" v-on:update-active="updateActiveScenes($event)" :scene="scene" :lights="lightItems"></scene-card>
            </v-col>
        </v-row>
        <v-dialog
            v-model="deleteSceneDialog"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="text-h5">
                    Confirm Deletion
                </v-card-title>
                <v-card-text v-if="toDeleteScene">
                    Are you sure you want to delete {{toDeleteScene.name}}?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteSceneDialog = false; toDeleteScene = null;"
                    >Cancel</v-btn>
                    <v-btn
                        color="red darken-1"
                        text
                        @click="deleteScene(toDeleteScene.id)"
                    >Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {ScenesService} from '../services/Scenes.service';
import SceneCard from './SceneCard.vue';
import Scene from '../types/Scene.type';
import Stage from '../types/Stage.type';
export default {
  components: { SceneCard },
    name: 'Scenes',

    props: {
        lights: {
            type: Array,
            default: () => []
        }
    },

    computed: {
        lightItems: function() {
            return this.lights.map(val => {return { text: val.name, value: val }})
        }
    },

    data: function() {
        return {
            scenes: [],
            createSceneDialog: false,
            deleteSceneDialog: false,
            toDeleteScene: null,
            newScene: new Scene()
        };
    },

    methods: {
        getScenes: function() {
            ScenesService.getScenes().then(res => {
                this.scenes = res.map((json) => {
                    let scene = Scene.from(json);
                    scene.stages = scene.stages.map(stage => Stage.from(stage));
                    return scene;
                });
            },
            rej => console.log(rej));
        },
        createScene: function() {
            ScenesService.createScene(this.newScene).then(() => {
                this.createSceneDialog = false;
                this.resetNewScene();
                this.getScenes();
            },
            rej => {
                console.log(rej);
                this.createSceneDialog = false;
                this.resetNewScene();
            })
        },
        confirmDeleteScene: function(scene) {
            this.toDeleteScene = scene;
            this.deleteSceneDialog = true;
        },
        deleteScene: function(id) {
            ScenesService.deleteScene(id).then(() => {
                this.deleteSceneDialog = false;
                this.getScenes();
            },
            rej => {
                console.log(rej);
                this.deleteSceneDialog = false;
            })
        },
        resetNewScene: function() {
            this.newScene = new Scene()
        },
        updateActiveScenes(activeScenes) {
            console.log('update active');
            for (let i = 0; i < this.scenes.length; i++) {
                if (activeScenes.includes(this.scenes[i].id)) {
                    this.scenes[i].active = true;
                }else{
                    this.scenes[i].active = false;
                }
            }
        }
    },

    mounted: function() {
        this.resetNewScene();
        this.getScenes();
    }
}
</script>