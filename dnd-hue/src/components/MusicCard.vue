<template>
    <v-card>
        <v-progress-linear
            :indeterminate="!music.loaded"
            :active="loading || music.loaded"
            :value="trackPos"
            height="6"
        ></v-progress-linear>
        <v-card-title class="pb-0">
            <v-container no-gutters class="mt-n5 pb-0">
            <v-row no-gutters align="center">
            <h2 class="vecna-font">{{ music.title }}</h2>
            <v-spacer></v-spacer>
            <v-btn
                icon
                small
                @click="togglePlayPause()"
                :loading="loading && !music.loaded"
            ><v-icon v-if="!music.playing">mdi-play-circle-outline</v-icon><v-icon v-else>mdi-pause-circle-outline</v-icon></v-btn>
            <v-btn
                icon
                small
                @click="toggleLoop()"
                :color="music.loop ? 'green' : ''"
            ><v-icon>mdi-sync</v-icon></v-btn>
            <v-btn
                v-if="!editing"
                icon
                small
                @click="edit()"
            ><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn
                v-if="editing"
                icon
                small
                @click="save()"
            ><v-icon>mdi-content-save</v-icon></v-btn>
            <v-btn
                v-if="editing"
                icon
                small
                @click="cancel()"
            ><v-icon>mdi-cancel</v-icon></v-btn>
            </v-row>
            </v-container>
            
        </v-card-title>
        <v-container v-if="music.loaded">
            <v-row no-gutters>
                <v-col>
                <v-slider
                    min=0.0
                    max=1.0
                    step=0.1
                    label="Volume"
                    v-model="music.volume"
                ></v-slider>
                </v-col>
            </v-row>
        </v-container>
        <v-card-text class="mt-n1">
        </v-card-text>
    </v-card>
</template>

<script>
import MusicFile from '../types/MusicFile.type';
export default {
    name: 'MusicCard',
    data: function() {
        return {
            trackPos: 0,
            trackInterval: null,
            loading: false,
            editing: false
        }
    },
    props: {
        music: {
            type: MusicFile,
            default: function() {
                return new MusicFile();
            }
        },
    },
    computed: {
        trackPosition: function() {
            return this.music.trackPosition;
        }
    },
    methods: {
        togglePlayPause: function() {
            this.loading = true;
            this.music.toggle();
            this.startTrackingPosition();
        },
        toggleLoop: function() {
            this.music.loop = !this.music.loop;
        },
        cardClicked: function() {

        },
        edit: function() {
            if (this.editing) return;
            this.editing = true;
        },
        cancel: function() {
            this.editing = false;
        },
        save: function() {
            this.editing = false;
        },
        startTrackingPosition: function() {
            if (this.trackInterval !== null) {
                clearInterval(this.trackInterval);
            }
            let _this = this;
            this.trackInterval = setInterval(() => {
                _this.trackPos = this.music.trackPosition;
            },200);
        },
        stopTrackingPosition: function() {
            if (this.trackInterval !== null) {
                clearInterval(this.trackInterval);
            }
        }
    }
}
</script>