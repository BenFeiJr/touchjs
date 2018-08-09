/**
 * 1. 创建自定义事件实例 new Event('tap)
 * 2. 添加事件 element.addEventListener
 * 3. 发布事件 element.dispatchEvent
 * api: touch(element).on('tap', handler) 参数和addeventListener保持一致
 * Init的时候把touchstart等事件都绑进去，然后存下来on了哪些touch事件，off的时候先删除存的事件，全部删除之后就解绑touchstart等事件
 * 那就不需要事件的类了，touch里面只保留对事件触发的判断
 */

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
        console.log(e);
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

            if (this._canTriggerTapEvent()) {
                this.element.dispatchEvent(this._getEventInstance(tapEventName));
            }
        });
    },
    _canTriggerTapEvent: function () {
        const tapEventName = this._EVENT_NAME_MAP.TAP;
        return this._getEventInstance(tapEventName) && this._isBelongTapEvent();
    },
    _isBelongTapEvent: function () {
        // TODO: 最大的值怎么得出来？
        const maxDelay = 300; // ms
        const maxOffset = 16;
        const info = this._originalEventInfo;
        const l = info.touchend.changedTouches.length;
        const offsetX = info.touchend.changedTouches[l - 1].screenX - info.touchstart.touches[0].screenX;
        const offsetY = info.touchend.changedTouches[l - 1].screenY - info.touchstart.touches[0].screenY;

        const isLessMaxDelay = info.touchend.timeStamp - info.touchstart.timeStamp < maxDelay;
        const isLessMaxOffset = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)) < maxOffset;

        return isLessMaxDelay && isLessMaxOffset;
    },
    _canTriggerPressEvent: function () {
        const pressEventName = this._EVENT_NAME_MAP.PRESS;
        return this._getEventInstance(pressEventName) && this._isBelongPressEvent();
    },
    _isBelongPressEvent: function () {
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
