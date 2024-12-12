export const fleetMachineHealthByIdDemoData = {
  kpiUom: {
    weightMachineHour: 'lbs / cycle',
    failedCycleMachineHour: null,
    cyclecountMachineHour: 'Total in last hour',
    waitTimeMachineHour: 'min. / cycle',
    machineState: null,
    machineCondition: null,
    cyclecountPluShift: 'in shift'
  },
  machineKpis: [
    {
      id: '997be3d3-5200-46cb-b9b5-4ff35c0149fe',
      machineDesc: 'Avure-AV-M-80167',
      plantId: '0013600001EJqVtAAL',
      data: {
        weightMachineHour: [],
        failedCycleMachineHour: [],
        cyclecountMachineHour: [],
        waitTimeMachineHour: [],
        machineState: [],
        cyclecountPluShift: [],
        machineCondition: [
          {
            kpi: 'machine_condition',
            subComponent: null,
            values: {
              actual: 0,
              target: null
            },
            threshold: {
              status: 'N/A',
              value: {
                lower: null,
                upper: null
              }
            },
            timestamp: '12/07/2023 14:33:49',
            state: '11 Sub-systems at risk',
            statusDescription: null
          }
        ]
      },
      pluData: {},
      subComponentData: [
        {
          name: 'HPP',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            pressureVessel: [
              {
                kpi: 'pressure_vessel',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'Decomp Valve L',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            decompValveTemperatureL: [
              {
                kpi: 'decomp_valve_temperature_l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'Decomp Valve R',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            decompValveTemperatureR: [
              {
                kpi: 'decomp_valve_temperature_r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'HPU0 L1',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            hpu0CheckValveTemperatureL1L: [
              {
                kpi: 'hpu_0_check_valve_temperature_l1l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0CheckValveTemperatureL1R: [
              {
                kpi: 'hpu_0_check_valve_temperature_l1r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0IntensifierStrokeRateL1Ltor: [
              {
                kpi: 'hpu_0_intensifier_stroke_rate_l1_ltor',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0IntensifierStrokeRateL1Rtol: [
              {
                kpi: 'hpu_0_intensifier_stroke_rate_l1_rtol',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0MotorCurrentLeft: [
              {
                kpi: 'hpu_0_motor_current_left',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0MotorSpeedLeft: [
              {
                kpi: 'hpu_0_motor_speed_left',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'HPU0 L2',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            hpu0CheckValveTemperatureL2L: [
              {
                kpi: 'hpu_0_check_valve_temperature_l2l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0CheckValveTemperatureL2R: [
              {
                kpi: 'hpu_0_check_valve_temperature_l2r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0IntensifierStrokeRateL2Ltor: [
              {
                kpi: 'hpu_0_intensifier_stroke_rate_l2_ltor',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0IntensifierStrokeRateL2Rtol: [
              {
                kpi: 'hpu_0_intensifier_stroke_rate_l2_rtol',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0MotorCurrentLeft: [
              {
                kpi: 'hpu_0_motor_current_left',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0MotorSpeedLeft: [
              {
                kpi: 'hpu_0_motor_speed_left',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'HPU0 R1',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            hpu0CheckValveTemperatureR1L: [
              {
                kpi: 'hpu_0_check_valve_temperature_r1l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0CheckValveTemperatureR1R: [
              {
                kpi: 'hpu_0_check_valve_temperature_r1r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0IntensifierStrokeRateR1Ltor: [
              {
                kpi: 'hpu_0_intensifier_stroke_rate_r1_ltor',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0IntensifierStrokeRateR1Rtol: [
              {
                kpi: 'hpu_0_intensifier_stroke_rate_r1_rtol',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0MotorCurrentRight: [
              {
                kpi: 'hpu_0_motor_current_right',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0MotorSpeedRight: [
              {
                kpi: 'hpu_0_motor_speed_right',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'HPU0 R2',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            hpu0CheckValveTemperatureR2L: [
              {
                kpi: 'hpu_0_check_valve_temperature_r2l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0CheckValveTemperatureR2R: [
              {
                kpi: 'hpu_0_check_valve_temperature_r2r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0IntensifierStrokeRateR2Ltor: [
              {
                kpi: 'hpu_0_intensifier_stroke_rate_r2_ltor',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0IntensifierStrokeRateR2Rtol: [
              {
                kpi: 'hpu_0_intensifier_stroke_rate_r2_rtol',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0MotorCurrentRight: [
              {
                kpi: 'hpu_0_motor_current_right',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu0MotorSpeedRight: [
              {
                kpi: 'hpu_0_motor_speed_right',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'HPU1 L1',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            hpu1CheckValveTemperatureL1L: [
              {
                kpi: 'hpu_1_check_valve_temperature_l1l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1CheckValveTemperatureL1R: [
              {
                kpi: 'hpu_1_check_valve_temperature_l1r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1IntensifierStrokeRateL1Ltor: [
              {
                kpi: 'hpu_1_intensifier_stroke_rate_l1_ltor',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1IntensifierStrokeRateL1Rtol: [
              {
                kpi: 'hpu_1_intensifier_stroke_rate_l1_rtol',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1MotorCurrentLeft: [
              {
                kpi: 'hpu_1_motor_current_left',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1MotorSpeedLeft: [
              {
                kpi: 'hpu_1_motor_speed_left',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'HPU1 L2',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            hpu1CheckValveTemperatureL2L: [
              {
                kpi: 'hpu_1_check_valve_temperature_l2l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1CheckValveTemperatureL2R: [
              {
                kpi: 'hpu_1_check_valve_temperature_l2r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1IntensifierStrokeRateL2Ltor: [
              {
                kpi: 'hpu_1_intensifier_stroke_rate_l2_ltor',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1IntensifierStrokeRateL2Rtol: [
              {
                kpi: 'hpu_1_intensifier_stroke_rate_l2_rtol',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1MotorCurrentLeft: [
              {
                kpi: 'hpu_1_motor_current_left',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1MotorSpeedLeft: [
              {
                kpi: 'hpu_1_motor_speed_left',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'HPU1 R1',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            hpu1CheckValveTemperatureR1L: [
              {
                kpi: 'hpu_1_check_valve_temperature_r1l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1CheckValveTemperatureR1R: [
              {
                kpi: 'hpu_1_check_valve_temperature_r1r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1IntensifierStrokeRateR1Ltor: [
              {
                kpi: 'hpu_1_intensifier_stroke_rate_r1_ltor',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1IntensifierStrokeRateR1Rtol: [
              {
                kpi: 'hpu_1_intensifier_stroke_rate_r1_rtol',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1MotorCurrentRight: [
              {
                kpi: 'hpu_1_motor_current_right',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1MotorSpeedRight: [
              {
                kpi: 'hpu_1_motor_speed_right',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        },
        {
          name: 'HPU1 R2',
          state: {
            displayName: 'N/A',
            value: 'N/A'
          },
          status: null,
          action: null,
          data: {
            hpu1CheckValveTemperatureR2L: [
              {
                kpi: 'hpu_1_check_valve_temperature_r2l',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1CheckValveTemperatureR2R: [
              {
                kpi: 'hpu_1_check_valve_temperature_r2r',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1IntensifierStrokeRateR2Ltor: [
              {
                kpi: 'hpu_1_intensifier_stroke_rate_r2_ltor',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1IntensifierStrokeRateR2Rtol: [
              {
                kpi: 'hpu_1_intensifier_stroke_rate_r2_rtol',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1MotorCurrentRight: [
              {
                kpi: 'hpu_1_motor_current_right',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ],
            hpu1MotorSpeedRight: [
              {
                kpi: 'hpu_1_motor_speed_right',
                subComponent: null,
                values: {
                  actual: '-',
                  target: null
                },
                threshold: {
                  status: 'N/A',
                  value: {
                    lower: null,
                    upper: null
                  }
                },
                timestamp: '12/07/2023 14:33:49',
                state: null,
                statusDescription: null
              }
            ]
          }
        }
      ]
    }
  ]
};
