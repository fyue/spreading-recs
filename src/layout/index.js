import React from 'react';
import classnames from 'classnames';
import css from './index.less';

const htmlRootSize = getComputedStyle(window.document.documentElement)['font-size']

const {sqrt, ceil, PI} = Math;

const addEvent = (el, event, handler) => {
  if (!el) return;
  if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else if (el.addEventListener) {
    el.addEventListener(event, handler, false);
  } else {
    el['on' + event] = handler;
  }
};

const removeEvent = (el, event, handler) => {
  if (!el) return;
  if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler, false);
  } else {
    el['on' + event] = null;
  }
};

const clientWidth = document.documentElement.clientWidth;

const arr = [
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
];
/*const arr = [
  ['', '', '','', '', '','', '', '','', '', '','', '', '',]
];*/

class Layout extends React.Component {
  // shared variaty
  Radius = 0; //300
  itemClicked = false;
  isSpreading = false;

  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0,
      showItemDetail: false,
    };
    this.hiddenDetail = this.hiddenDetail.bind(this);
  }

  hiddenDetail() {


    if (!this.isSpreading) {
      this.Radius = 0;

      this.itemClicked = false;

      this.setState({
        showItemDetail: false,
      });
    }
  }

  componentDidUpdate() {
    // console.log(this.Radius);
  }

  componentDidMount() {
    let STEP = 1;
    //let Radius = this.Radius; // 300
    let Ox = 500;
    let Oy = 600;

    class Rec {
      constructor(initX, initY) {
        this.X = initX;
        this.Y = initY;
        this.initY = initY;
      }

      changeX(x) {
        this.X = x;
      }

      changeY(y) {
        this.Y = y;
      }
    }

    let drawing = this.refs.drawing;

    const hanldClick = (e) => {
      console.log(0);
      let Cx = e.clientX * 108 / parseInt(htmlRootSize);
      let Cy = e.clientY * 108 / parseInt(htmlRootSize);

      outer:
      for( let i = 0; i < arr.length; i += 1) {
        for( let j = 0; j < arr[i].length; j += 1) {
          let item = arr[i][j];
          if ((Cx >= item.X && Cx <= item.X + 80) && (Cy >= item.Y && Cy <= item.Y + 80)) {
            console.log(item); //todo
            this.setState({
              left: Cx,
              top: Cy,
              showItemDetail: true,
            });
            this.itemClicked = true;
            break outer; // 终止外循环
          }
          this.itemClicked = false;
        }
      }

      /*arr.forEach((_item, index) => {
        _item.forEach((item, idx) => {
          if ((Cx >= item.X && Cx <= item.X + 80) && (Cy >= item.Y && Cy <= item.Y + 80)) {
            console.log(item); //todo
            this.setState({
              left: Cx,
              top: Cy,
              showItemDetail: true,
            });
          }
        });
      });*/
      // 动态增加扩散半径
      if (this.itemClicked) {
        const incRadius = (val) => {
          this.isSpreading = true;
          if (val - this.Radius > 0.001) {
            this.Radius += (val - this.Radius) / 20;
            setTimeout(() => {
              incRadius(val);
            }, 10);
          } else {
            this.isSpreading = false;
            console.log('increased Done!');
          }
        };

        Ox = Cx;
        Oy = Cy;
        incRadius(350);
      }
    };

    // 绑定事件
    addEvent(drawing, 'click', hanldClick);

    if (drawing.getContext) {
      let context = drawing.getContext('2d');
      context.fillStyle = '#00ff00';

      // 构造对象
      arr.forEach((_item, index) => {
        _item.forEach((item, idx) => {
          arr[index][idx] = new Rec(1000 - index * 100, idx * 100);
          arr[index][idx].img = new Image();
          arr[index][idx].img.src = '//f10.baidu.com/it/u=3438140340,1307248730&fm=72';
        });
        // arr[index] = new Rec(initX, index * 100);
      });

      // 初始渲染,可去掉
      /*arr.forEach((_item, index) => {
        _item.forEach((item, idx) => {
          //context.fillRect(item.X, item.Y, 80, 80);
          context.drawImage(item.img, item.X, item.Y, 80, 80);
        });
      });*/


      // 向左循环轮播
      const Ticker = setInterval(() => {
        // 清除重绘
        context.clearRect(0, 0, 1080, 1920);

        // 绘制下一帧
        arr.forEach((_item, index) => {
          _item.forEach((item, idx) => {
            const {X, Y, initY} = item;

            let itemX = X <= -80 ? 1080 : X - STEP;
            let itemY = Y;

            // 前半个圆
            if (this.itemClicked) { // 是否击中了图片, 点中间隔无效
              if ((X > Ox) && ((X - Ox) ** 2 + (Y - Oy) ** 2 <= this.Radius ** 2)) {
                if (Y <= Oy) {
                  itemY = Oy - sqrt(this.Radius ** 2 - (X - Ox) ** 2);
                } else {
                  itemY = Oy + sqrt(this.Radius ** 2 - (X - Ox) ** 2);
                } // 后半个正方形
              } else if ((X >= (Ox - this.Radius) && X <= Ox) && (Y >= (Oy - this.Radius) && Y <= (Oy + this.Radius))) {
                if (Y <= Oy) {
                  let computeY = Oy - sqrt(this.Radius ** 2 - (X - Ox) ** 2);
                  itemY = initY > computeY ? computeY : initY;
                } else {
                  let computeY = Oy + sqrt(this.Radius ** 2 - (X - Ox) ** 2);
                  itemY = initY < computeY ? computeY : initY;
                }
              }
            } else {
              if (itemY < initY) {
                itemY += (initY - itemY) / 20;
              } else if (itemY > initY) {
                itemY -= (itemY - initY) / 20;
              }
            }

            item.changeX(itemX); // parseInt解决清除绘画时有残余问题
            item.changeY(itemY); // parseInt解决清除绘画时有残余问题

            // 重绘新位置的矩形
            // context.fillRect(item.X, item.Y, 80, 80);
            context.drawImage(item.img, item.X, item.Y, 80, 80);
          });
        });

        // 绘制圆
        context.beginPath();
        context.arc(Ox, Oy, this.Radius, 0, 2 * PI, false);
        context.stroke();

      }, 16);
    }
  }

  render() {
    const cls = classnames([css.layout]);
    const {left, top, showItemDetail} = this.state;

    const portalProps = {
      style: {
        left: `${left / 108}rem`,
        top: `${top / 108}rem`,
      }
    };
    return (
      <div className={cls}>
        {showItemDetail ? <div onClick={this.hiddenDetail} className={css.portal} {...portalProps}>点击关闭</div> : ''}
        <canvas width="1080" height="1920" ref="drawing">您的设备不支持canvas</canvas>
      </div>
    );
  }
}
export default Layout;
