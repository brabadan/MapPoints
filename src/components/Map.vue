<template>
    <div class="container">
        <div class="input-list">
            <sui-input
                    placeholder="Новая точка маршрута"
                    v-model="newPointName"
                    v-on:keyup="onEnter"
            />

            <draggable
                    class="list-group"
                    tag="ul"
                    v-model="points"
                    v-bind="dragOptions"
                    @start="isDragging = true"
                    @end="isDragging = false"
                    :component-data="getComponentData()"
            >
                <transition-group type="transition" name="flip-list">
                    <div
                            class="list-group-item"
                            v-for="(point, index) in points"
                            :key="point.order"
                    >
                        {{ point.name }}
                        <button
                                size="small"
                                v-on:click="removePoint(index)"
                        >
                            x
                        </button>
                    </div>
                </transition-group>
            </draggable>
        </div>

        <div id="map" style="width: 600px; height: 400px"></div>
    </div>
</template>

<script>
    import $ from 'jquery';  // подключаем jQuery
    import draggable from "vuedraggable";

    export default {
        name: "map",
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
            handleChange() {
                console.log('changed');
                console.dir(this.points);
                this.refreshPolyline();
            },
            inputChanged(value) {
                this.activeNames = value;
            },
            getComponentData() {
                return {
                    on: {
                        change: this.handleChange,
                        input: this.inputChanged
                    },
                    attrs: {
                        wrap: true
                    },
                    props: {
                        value: this.activeNames
                    }
                };
            }
        },
        mounted() {
            this.loadJs('https://api-maps.yandex.ru/2.1/?apikey=84058bf3-7dd7-4fb0-a8b6-729d56f01663&lang=ru_RU', () => {
                ymaps.ready(() => {
                    this.map = new ymaps.Map("map", {
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
    }

    .input-list {
        width: 40%;
        text-align: end;
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
    }

    .list-group-item {
        cursor: move;
    }

    .list-group-item i {
        cursor: pointer;
    }
</style>
