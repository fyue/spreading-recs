import React from 'react';
import classnames from 'classnames';
import css from './index.less';

const {sqrt, floor, PI} = Math;

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }

  componentDidMount() {
    let STEP = 10;

    let Radius = 400;
    let Ox = 500;
    let Oy = 800;

    const multiArr = [
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', ''],
    ];

    const arr = ['', '', '', '', '', '', '', '', '', '', '', ''];
    let initX = 1000;

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
    if (drawing.getContext) {
      let context = drawing.getContext('2d');
      context.fillStyle = '#00ff00';

      // 构造对象
      arr.forEach((item, index) => {
        arr[index] = new Rec(initX, index * 100);
      });

      // 初始渲染
      arr.forEach((item) => {
        context.fillRect(item.X, item.Y, 80, 80);
      });

      // 向左循环轮播
      setInterval(() => {
        // 清除已绘的当前位置的矩形
        arr.forEach((item) => {
          context.clearRect(item.X, item.Y, 80, 80);
        });


        arr.forEach((item) => {
          // 更新位置
          const {X, Y, initY} = item;

          let itemX = X === -80 ? 1080 : X - STEP;
          let itemY = Y;
          /*if (X >= Ox - Radius && X <= Ox + Radius && Y <= Oy && Y > Oy - Radius) { // 第一、二象限
            itemY = Oy - sqrt(Radius ** 2 - (X - Ox) ** 2);
          } else if (X >= Ox - Radius && X <= Ox + Radius && Y <= Oy + Radius && Y > Oy ) { // 第三、四象限
            itemY = Oy + sqrt(Radius ** 2 - (X - Ox) ** 2);
          }*/

          if ((X > Ox) && ((X - Ox) ** 2 + (Y - Oy) ** 2 <= Radius ** 2)) {
            if (Y <= Oy) {
              itemY = Oy - sqrt(Radius ** 2 - (X - Ox) ** 2);
            } else if (Y > Oy) {
              itemY = Oy + sqrt(Radius ** 2 - (X - Ox) ** 2);
            }
          }
          if ((X >= (Ox - Radius) && X <= Ox) && (Y >= (Oy - Radius) && Y <= (Oy + Radius))) {
            if (Y <= Oy) {
              let computeY = Oy - sqrt(Radius ** 2 - (X - Ox) ** 2);
              itemY = initY > computeY ? computeY : initY;
            } else {
              let computeY = Oy + sqrt(Radius ** 2 - (X - Ox) ** 2);
              itemY = initY < computeY ? computeY : initY;
            }
          }


          item.changeX(parseInt(itemX)); // parseInt是必须的，解决清除绘画时有残余问题
          item.changeY(parseInt(itemY)); // parseInt是必须的，解决清除绘画时有残余问题

          // 重绘新位置的矩形
          context.fillRect(item.X, item.Y, 80, 80);

        });

        // 绘制圆
        context.beginPath();
        context.arc(Ox, Oy, Radius, 0, 2 * PI, false);
        context.stroke();

      }, 16);
    }
  }

  render() {
    const cls = classnames([css.layout]);
    return (
      <div className={cls}>
        <canvas ref="drawing" width="1080" height="1980">您的设备不支持canvas</canvas>
      </div>
    );
  }
}
export default Layout;
