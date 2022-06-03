<template>
    <v-card>
        <v-card-title class="pb-0">
            <v-container no-gutters class="mt-n5 pb-0">
            <v-row no-gutters align="center">
            <h2 class="vecna-font">{{ music.title }}</h2>
            </v-row>
            </v-container>
            
        </v-card-title>
        <v-card-text class="mt-n1">
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'MusicCard',
    props: {
        music: {
            type: Object,
            default: function() {
                return {}
            }
        },
    }
}
</script>