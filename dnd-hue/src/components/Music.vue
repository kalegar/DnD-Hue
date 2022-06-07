<template>
    <v-container>
        <v-row>
            <h1 class="vecna-font">Music</h1>
            <v-dialog
                v-model="uploadMusicDialog"
                persistent
                max-width="600px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        fab
                        class="mx-2 mt-n1"
                        v-bind="attrs"
                        v-on="on"
                        color="primary"
                    ><v-icon large>mdi-plus</v-icon></v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="text-h4">Upload Music</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        v-model="upload.title"
                                        label="Scene Name"
                                        required
                                    ></v-text-field>
                                    <v-file-input
                                        accept="audio/*"
                                        label="Audio File"
                                        v-model="upload.file"
                                        required
                                    ></v-file-input>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="uploadMusicDialog = false; resetUploadMusic()"
                        >Cancel</v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="uploadMusic()"
                        >Create</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
        <v-row>
            <v-col v-for="(file) in music" :key="file.id" cols="12" md="6" lg="4" xl="3">
                <music-card :music="file" v-on:delete="confirmDeleteMusic(file)"></music-card>
            </v-col>
        </v-row>
        <v-dialog
            v-model="deleteMusicDialog"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="text-h5">
                    Confirm Deletion
                </v-card-title>
                <v-card-text v-if="toDeleteMusic">
                    Are you sure you want to delete {{toDeleteMusic.title}}?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="deleteMusicDialog = false; toDeleteMusic = null;"
                    >Cancel</v-btn>
                    <v-btn
                        color="red darken-1"
                        text
                        @click="deleteMusic(toDeleteMusic.id)"
                    >Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {MusicService} from '../services/Music.service';
import MusicFile from '../types/MusicFile.type';
import MusicCard from './MusicCard.vue';
export default {
  components: { MusicCard },
    name: 'Music',

    data: function() {
        return {
            uploadMusicDialog: false,
            upload: {
                file: null,
                title: ''
            },
            music: [],
            deleteMusicDialog: false,
            toDeleteMusic: null
        }
    },
    methods: {
        getMusic: function() {
            MusicService.getMusic().then(res => {
                this.music = res.map(obj => MusicFile.from(obj))
                console.log(this.music);
            },
            rej => console.log(rej));
        },
        uploadMusic: function() {
            MusicService.uploadMusic(this.upload).then(() => {
                this.uploadMusicDialog = false;
                this.resetUploadMusic();
                this.getMusic();
            },
            rej => {
                console.log(rej);
                this.uploadMusicDialog = false;
                this.resetUploadMusic();
            })
        },
        resetUploadMusic: function() {
            this.upload = {
                file: null,
                title: ''
            }
        },
        confirmDeleteMusic: function(musicFile) {
            this.toDeleteMusic = musicFile;
            this.deleteMusicDialog = true;
        },
        deleteMusic: function(musicFileId) {
            MusicService.deleteMusic(musicFileId).then(() => {
                this.deleteMusicDialog = false;
                this.getMusic();
            },
            rej => {
                console.log(rej);
                this.deleteMusicDialog = false;
            })
        }
    },
    mounted: function() {
        this.getMusic();
    }
}
</script>

<style scoped>
h1, h2, h3, h4 {
  color: white;
}
</style>