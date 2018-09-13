/**
 * TODO:
 * 1、事件委托
 * 2、多个手指测试
 */

/**
 * 1. 创建自定义事件实例 new Event('tap)
 * 2. 添加事件 element.addEventListener
 * 3. 发布事件 element.dispatchEvent
 * api: touch(element).on('tap', handler) 参数和addeventListener保持一致
 * Init的时候把touchstart等事件都绑进去，然后存下来on了哪些touch事件，off的时候先删除存的事件，全部删除之后就解绑touchstart等事件
 * 那就不需要事件的类了，touch里面只保留对事件触发的判断
 */

// TODO: 有一个方法，这个方法会返回用户的手指的轨迹数学表达，比如，开始到结束移动距离和角度，开始到中间移动距离和角度，中间到结束移动距离和角度
// direction { up, down, left, right}

const touch = function (element) {
    return new touch.prototype.Init(element);
};

touch.prototype = {
    version: '0.0.1',
    constructor: touch,
    _EVENT_NAME_MAP: {
        TAP: 'tap',
        PRESS: 'press',
        SWIPE: 'swipe',
        PINCH: 'pinch'
    },
    _originalEventInfo: {},
    Init: function (element) {
        this.element = element;
        this._bindedEventList = [];

        this._resetOriginalEventInfo();
        this._bindOriginalEvent();

        return this;
    },
    _resetOriginalEventInfo: function () {
        this._originalEventInfo = {
            touchstart: {},
            touchmove: [],
            touchend: {}
        };
    },
    _updateOriginalEventInfo: function (originalEventName, e) {
        console.log(originalEventName, e);
        const isTouchMove = originalEventName === 'touchmove';
        const eventInfo = {
            timeStamp: e.timeStamp,
            changedTouches: e.changedTouches,
            touches: e.touches
        };

        if (isTouchMove) {
            this._originalEventInfo[originalEventName].push(eventInfo);
        }
        else {
            this._originalEventInfo[originalEventName] = eventInfo;
        }
    },
    _bindOriginalEvent: function () {
        const tapEventName = this._EVENT_NAME_MAP.TAP;

        this.element.addEventListener('touchstart', (e) => {
            this._updateOriginalEventInfo('touchstart', e);
        });

        this.element.addEventListener('touchmove', (e) => {
            this._updateOriginalEventInfo('touchmove', e);
        });

        this.element.addEventListener('touchend', (e) => {
            this._updateOriginalEventInfo('touchend', e);

            if (this._canTriggerCustomEvent(tapEventName)) {
                this.element.dispatchEvent(this._getEventInstance(tapEventName));
            }
        });
    },
    /**
     * @range {string} all, firstHalf, secondHalf
     */
    _getMotion: function (range = 'all') {
        const f = this._originalEventInfo;
        const moves = [f.touchstart].concat(f.touchmove).concat([f.touchend]);
        const firstIndex = 0;
        const halfIndex = Math.floor(moves.length / 2);
        const lastIndex = moves.length - 1;
        const indexMap = {
            all: [firstIndex, lastIndex],
            firstHalf: [firstIndex, halfIndex],
            secondHalf: [halfIndex, lastIndex]
        };
        const move_begin = moves[indexMap[range][0]];
        const move_end = moves[indexMap[range][1]];

        const dt = move_end.timeStamp - move_begin.timeStamp;
        const dx = move_end.screenX - move_begin.screenX;
        // 坐标系更改成左下角
        const dy = (window.screen.height - move_end.screenY) - (window.screen.height - move_begin.screenY);
        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        const duration = dt;
        const distance = dist;
        let angle = 180 * (Math.atan2(dy, dx)) / Math.PI;
        let direction = '';

        // 一象限
        if (dx > 0 && dy > 0) {
            if (angle <= 45) {
                direction = 'right';
            }
            else {
                angle = 90 - angle;
                direction = 'up';
            }
        }
        // 二象限
        if (dx < 0 && dy > 0) {
            if (angle <= 135) {
                angle = angle - 90;
                direction = 'up';
            }
            else {
                angle = 180 - angle;
                direction = 'left';
            }
        }
        // 三象限
        if (dx < 0 && dy < 0) {
            if (angle <= -135) {
                angle = 180 - Math.abs(angle);
                direction = 'left';
            }
            else {
                angle = Math.abs(angle) - 90;
                direction = 'down';
            }
        }
        // 四象限
        if (dx > 0 && dy < 0) {
            if (angle <= -45) {
                angle = 90 - Math.abs(angle);
                direction = 'down';
            }
            else {
                angle = Math.abs(angle);
                direction = 'right';
            }
        }

        return {
            duration,
            direction,
            distance,
            angle
        };
    },
    _isBelongCustomEvent: function (eventName) {
        let isBelong;

        switch (eventName) {
            case this._EVENT_NAME_MAP.TAP: {
                const motion = this._getMotion();
                // TODO: 最大的值怎么得出来？
                isBelong = motion.duration < 300 && motion.distance < 16;
                break;
            }
        }

        return isBelong;
    },
    _canTriggerCustomEvent: function (eventName) {
        return this._getEventInstance(eventName) && this._isBelongCustomEvent(eventName);
    },
    _getBindedEventListItem: function (eventName) {
        return this._bindedEventList.find((item) => {
            return item.name === eventName;
        }) || {};
    },
    _addBindedEventListItem: function (item) {
        this._bindedEventList.push(item);
    },
    _deleteBindedEventListItem: function (item) {},
    _getEventInstance: function (eventName) {
        return this._getBindedEventListItem(eventName).instance;
    },
    on: function (eventName, eventHandler) {
        const bindedEventListItem = {
            name: eventName,
            instance: new Event(eventName)
        };

        this._addBindedEventListItem(bindedEventListItem);
        this.element.addEventListener(eventName, eventHandler);
    },
    off: function (eventName, eventHandler) {
        // 删除_bindedEventList中name = eventName的项
        // 如果删除完为空数组了，就解绑originalEvent
    }
};

touch.prototype.Init.prototype = touch.prototype;

export default touch;
