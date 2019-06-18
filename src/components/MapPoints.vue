<template>
    <div class="container">
        <div class="input-list">
            <input
                    placeholder="Новая точка маршрута"
                    v-model="newPointName"
                    v-on:keyup="onEnter"
                    style="width: calc(100% - 4px); height: 3em"
            />

            <draggable
                    class="list-group"
                    tag="ul"
                    v-model="points"
                    v-bind="dragOptions"
                    @start="isDragging = true"
                    @end="handleChange"
                    :component-data="getComponentData()"
            >
                <transition-group type="transition" name="flip-list">
                    <div
                            class="list-group-item"
                            v-for="(point, index) in points"
                            :key="point.order"
                    >
                        <span>{{ point.name }}</span>
                        <button
                                v-on:click="removePoint(index)"
                        >
                            x
                        </button>
                    </div>
                </transition-group>
            </draggable>

        </div>

        <div id="map-points" style="width: 60vw; max-width: 700px; height: 50vw; max-height: 70vh;"></div>
    </div>
</template>

<script>
    import $ from 'jquery';  // подключаем jQuery
    import draggable from "vuedraggable";

    export default {
        name: "map-points",
        components: {
            draggable,
        },
        methods: {
            onEnter(ev) {
                if (ev.key === 'Enter' && this.newPointName) {
                    this.addPoint(this.newPointName);
                    this.newPointName = '';
                }
            },
            loadJs(url, callback) {
                $.ajax({
                    url: url,
                    dataType: 'script',
                    success: callback,
                    async: true
                });
            },
            addPoint(name) {
                const placemark = new ymaps.Placemark(this.map.getCenter(), {balloonContentHeader: name}, {draggable: true});
                placemark.events.add('drag', () => {
                    this.refreshPolyline();
                });
                console.dir(placemark);

                const order = ++this.pointCounter;
                this.points.push({placemark, name, order});
                this.map.geoObjects.add(placemark);

                this.refreshPolyline();
            },
            removePoint(index) {
                this.map.geoObjects.remove(this.points[index].placemark);
                this.points.splice(index, 1);

                this.refreshPolyline();
            },
            refreshPolyline() {
                this.map.geoObjects.remove(this.polyline);

                this.polyline = new ymaps.Polyline(this.points.map(point => point.placemark.geometry._coordinates), {}, {
                    // Задаем опции геообъекта.
                    // Цвет с прозрачностью.
                    strokeColor: "#00000088",
                    // Ширину линии.
                    strokeWidth: 4,
                });

                this.map.geoObjects.add(this.polyline);
            },
            handleChange(ev) {
                console.log('changed');
                console.dir(ev);
                this.refreshPolyline();
            },
            getComponentData() {
                return {
                    attrs: {
                        wrap: true
                    },
                };
            }
        },
        mounted() {
            this.loadJs('https://api-maps.yandex.ru/2.1/?apikey=84058bf3-7dd7-4fb0-a8b6-729d56f01663&lang=ru_RU', () => {
                ymaps.ready(() => {
                    this.map = new ymaps.Map("map-points", {
                        center: [55.76, 37.64],
                        zoom: 7
                    });
                });

            });
        },
        data() {
            return {
                newPointName: '',
                points: [],
                map: {},
                polyline: {},
                pointCounter: 0
            }
        },
        computed: {
            dragOptions() {
                return {
                    animation: 0,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            }
        }
    }

</script>

<style scoped>
    .container {
        display: flex;
        margin: 5%;
        align-content: center;
        justify-content: center;
    }

    .input-list {
        width: 30%;
        max-width: 280px;
        text-align: end;
        margin-right: 12px;
    }

    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }

    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }

    .list-group {
        min-height: 20px;
        padding: 0;
    }

    .list-group-item {
        cursor: move;
        position: relative;
        display: block;
        padding: 10px 15px;
        margin-bottom: -1px;
        background-color: #fff;
        border: 1px solid #ddd;
    }

    .list-group-item span {
        float: left;
    }
</style>
