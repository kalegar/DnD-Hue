<template>
    <v-card>
        <v-hover v-slot="{ hover }" close-delay="100">
        <v-progress-linear
            :indeterminate="!music.loaded"
            :active="loading || music.loaded"
            :value="trackPos"
            :height="hover ? 16 : 6"
            @click="trackBarClick"
            ref="trackbar"
        ></v-progress-linear>
        </v-hover>
        <v-card-title class="pb-0">
            <v-container no-gutters class="mt-n5 pb-0">
            <v-row no-gutters align="center">
            <h2 class="vecna-font">{{ music.title }}</h2>
            <v-spacer></v-spacer>
            <v-btn
                icon
                small
                @click.stop="togglePlayPause()"
                :loading="loading && !music.loaded"
            ><v-icon v-if="!music.playing">mdi-play-circle-outline</v-icon><v-icon v-else>mdi-pause-circle-outline</v-icon></v-btn>
            <v-btn
                icon
                small
                @click.stop="toggleLoop()"
                :color="music.loop ? 'green' : ''"
            ><v-icon>mdi-sync</v-icon></v-btn>
            <v-btn
                v-if="!editing"
                icon
                small
                @click.stop="edit()"
            ><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn
                v-if="editing"
                icon
                small
                @click.stop="save()"
            ><v-icon>mdi-content-save</v-icon></v-btn>
            <v-btn
                v-if="editing"
                icon
                small
                @click.stop="deleteMusic()"
            ><v-icon>mdi-delete</v-icon></v-btn>
            <v-btn
                v-if="editing"
                icon
                small
                @click.stop="cancel()"
            ><v-icon>mdi-cancel</v-icon></v-btn>
            </v-row>
            </v-container>
            
        </v-card-title>
        <v-container>
            <v-row no-gutters>
                <v-col>
                <v-slider
                    min=0.0
                    max=1.0
                    step=0.1
                    label="Volume"
                    v-model="music.volume"
                    @click.stop
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
            if (!this.music.loaded) {
                this.loading = true;
                this.music.afterLoad = () => {this.loading = false;}
            }
            this.music.toggle();
            this.startTrackingPosition();
        },
        toggleLoop: function() {
            this.music.loop = !this.music.loop;
        },
        cardClicked: function() {
            this.togglePlayPause();
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
        deleteMusic: function() {
            this.music.stop();
            this.$emit('delete');
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
        },
        trackBarClick: function(event) {
            let offsets = event.target.getBoundingClientRect();
            console.log(this.$refs.trackbar);
            let seekPos = (event.pageX - offsets.left) / this.$refs.trackbar.$el.clientWidth;
            console.log(seekPos);
            this.music.seek(seekPos);
        }
    }
}
</script>