<template>
  <div class="main-home">
    <div class="home-top">
      <el-row :gutter="15">
        <el-col :span="6">
          <div class="item">
            <div class="item-icon"><i class="el-icon-document"></i></div>
            <div class="item-info">
              <span>今日访问</span>
              <nx-count-up :start="1" :end="12678"></nx-count-up>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="item">
            <div class="item-icon"><i class="el-icon-document"></i></div>
            <div class="item-info">
              <span>今日访问</span>
              <nx-count-up :start="1" :end="12678"></nx-count-up>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="item">
            <div class="item-icon"><i class="el-icon-document"></i></div>
            <div class="item-info">
              <span>今日访问</span>
              <nx-count-up :start="1" :end="12678"></nx-count-up>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="item">
            <div class="item-icon"><i class="el-icon-document"></i></div>
            <div class="item-info">
              <span>今日访问</span>
              <nx-count-up :start="1" :end="12678"></nx-count-up>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="home-contain">
      <el-row :gutter="15">
        <el-col :span="18">
          <div class="item">
            <highcharts-component :options="optionsLine" :styles="styleLine" ref="chartLine"></highcharts-component>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="item message-box" style="height:400px">
            <h3 class="message-title">未读消息 <a class="message-btn" href="">进入消息中心</a></h3>
            <div class="message-contain">
              <ul  class="message-list">
                <li>
                  <h3>[ 公告 ]<span>2018-08-22 14:30:00</span></h3>
                  <p>2018年08月19日联通线路访问百度云华南集群异常通告--已恢复</p>
                </li>
                <li>
                  <h3>[ 系统消息 ]<span>2018-08-22 14:30:00</span></h3>
                  <p>2018年08月19日联通线路访问百度云华南集群异常通告--已恢复</p>
                </li>
                <li>
                  <h3>[ 公告 ]<span>2018-08-22 14:30:00</span></h3>
                  <p>2018年08月19日联通线路访问百度云华南集群异常通告--已恢复</p>
                </li>
                <li>
                  <h3>[ 系统消息 ]<span>2018-08-22 14:30:00</span></h3>
                  <p>2018年08月19日联通线路访问百度云华南集群异常通告--已恢复</p>
                </li>
              </ul>
            </div>
            <div class="message-pagination">
              <el-pagination
                background
                small
                layout="prev, pager, next"
                :total="50">
              </el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="6">
          <div class="item">
            <highcharts-component :options="optionsPie" :styles="stylePie" ref="chartPie"></highcharts-component>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="item">
            <highcharts-component :options="optionsBar" :styles="styleBar" ref="chartBar"></highcharts-component>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/* eslint-disable indent */
import nxCountUp from '@/components/common/nxCountUp/NxCountUp'
import HighchartsComponent from '@/components/common/highcharts/Highcharts'
export default {
  data () {
    return {
      optionsLine: {
        title: {
            text: '2010 ~ 2016 年太阳能行业就业人员发展情况'
        },
        subtitle: {
            text: '数据来源：thesolarfoundation.com'
        },
        yAxis: {
            title: {
                text: '就业人数'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },
        series: [{
            name: '安装，实施人员',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
            name: '工人',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
        }, {
            name: '销售',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
        }, {
            name: '项目开发',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
        }, {
            name: '其他',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
      },
      styleLine: {
      },
      optionsPie: {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '2018年1月浏览器市场份额'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        // color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: [{
                name: 'Chrome',
                y: 61.41,
                sliced: true,
                selected: true
            }, {
                name: 'Internet Explorer',
                y: 11.84
            }, {
                name: 'Firefox',
                y: 10.85
            }, {
                name: 'Edge',
                y: 4.67
            }, {
                name: 'Safari',
                y: 4.18
            }, {
                name: 'Sogou Explorer',
                y: 1.64
            }, {
                name: 'Opera',
                y: 1.6
            }, {
                name: 'QQ',
                y: 1.2
            }, {
                name: 'Other',
                y: 2.61
            }]
        }]
      },
      stylePie: {},
      optionsBar: {
        chart: {
          type: 'bar'
        },
        title: {
          text: '各洲不同时间的人口条形图'
        },
        subtitle: {
          text: '数据来源: Wikipedia.org'
        },
        xAxis: {
          categories: ['非洲', '美洲', '亚洲', '欧洲', '大洋洲'],
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: '人口总量 (百万)',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: {
          valueSuffix: ' 百万'
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              allowOverlap: true // 允许数据标签重叠
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 100,
          floating: true,
          borderWidth: 1,
          // backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
          shadow: true
        },
        series: [{
          name: '1800 年',
          data: [107, 31, 635, 203, 2]
        }, {
          name: '1900 年',
          data: [133, 156, 947, 408, 6]
        }, {
          name: '2008 年',
          data: [973, 914, 4054, 732, 34]
        }]
      },
      styleBar: {}
    }
  },
  components: {
    nxCountUp,
    HighchartsComponent
  }
}
</script>

<style lang="scss" scoped>
.main-home{
  width: 100%;
  padding:15px;
  display: flex;
  background:#EAEDF1!important;
  flex-direction: column;
  overflow-y: auto;
  .home-top{
    margin-bottom: 15px;
    .item{
      display: flex;
      flex-direction: row;
      height: 80px;
      justify-content: flex-start;
      align-items: center;
      background:#fff;
      padding:0 10px;
      .item-icon i{
        font-size: 36px;
        margin-left: 16px;
      }
      .item-info{
        margin-left: 16px;
        span{
          color: #999;
          display: block;
          font-size: 12px;
          margin-bottom: 15px;
        }
        p{
          font-size: 20px;
        }
      }
    }
  }
  .home-contain{
    .el-row{
      margin-bottom: 15px;
      .item{
        background: #fff;
      }
      &:last-child{
        margin-bottom: 0;
      }
    }
    .message-box{
      display: flex;
      flex-direction: column;
      .message-title{
        height: 50px;
        line-height: 50px;
        padding:0 10px;
        border-bottom: 1px solid #E2E5EC;
        .message-btn{
          line-height: 24px;
          color: #333;
          border: 1px solid #ECEFF8;
          margin-left: 20px;
          padding: 0 10px;
          font-size: 12px;
          display: inline-block;
        }
      }
      .message-contain{
        flex: 1;
        .message-list{
          width: 100%;
          li{
            padding:10px 20px 0;
            background: #fff;
            &:hover{
              background:rgba(222,242,255,.4);
              cursor: pointer;
            }
            h3{
              font-size: 12px;
              line-height: 26px;
              color:#666;
              span{
                float: right;
                color:#999;
              }
            }
            p{
              color:#333;
              font-size: 1px;
              padding-bottom: 10px;
              border-bottom: 1px solid #E8EBEE;
            }
          }
        }
      }
      .message-pagination{
        height: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
      }
    }
  }
}

</style>
