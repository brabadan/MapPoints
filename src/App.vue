<template>
    <div id="app">
<!--        <HelloWorld msg="Welcome to Your Vue.js App"/>-->
        <Map />
    </div>
</template>

<script>
    import Map from './components/Map';

    export default {
        name: 'app',
        components: {
            Map,
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
