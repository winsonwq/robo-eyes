/**
 * RoboEyes AI Tools SDK
 * Define all available AI Tools and their JSON Schema
 */

/**
 * All available tool definitions
 * Each tool contains: name, description, parameters (JSON Schema)
 */
export const ROBOT_EYES_TOOLS = [
  {
    name: 'setMood',
    description: 'Set the emotion expression of the robot eyes. Supported moods include: DEFAULT (default), HAPPY (happy), TIRED (tired), ANGRY (angry), SUSPICIOUS (suspicious), SERIOUS (serious), IRRITATED (irritated), SAD (sad), HAPPYBLUSH (happy blush), FOCUSED (focused), EFFORT (effort), SURPRISED (surprised), EXCITED (excited), DETERMINED (determined)',
    parameters: {
      type: 'object',
      properties: {
        mood: {
          type: 'string',
          enum: ['DEFAULT', 'HAPPY', 'TIRED', 'ANGRY', 'SUSPICIOUS', 'SERIOUS', 'IRRITATED', 'SAD', 'HAPPYBLUSH', 'FOCUSED', 'EFFORT', 'SURPRISED', 'EXCITED', 'DETERMINED'],
          description: 'The mood type to set'
        }
      },
      required: ['mood']
    }
  },
  {
    name: 'setPosition',
    description: 'Set the eye gaze direction. Can be set to predefined directions (such as N, NE, E, etc.) or custom coordinate positions',
    parameters: {
      type: 'object',
      properties: {
        position: {
          oneOf: [
            {
              type: 'string',
              enum: ['DEFAULT', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
              description: 'Predefined direction: N (North), NE (Northeast), E (East), SE (Southeast), S (South), SW (Southwest), W (West), NW (Northwest), DEFAULT (default center)'
            },
            {
              type: 'object',
              properties: {
                x: {
                  type: 'number',
                  description: 'X coordinate position (between -1 and 1)'
                },
                y: {
                  type: 'number',
                  description: 'Y coordinate position (between -1 and 1)'
                }
              },
              required: ['x', 'y']
            }
          ],
          description: 'Eye position, can be a direction string or coordinate object'
        }
      },
      required: ['position']
    }
  },
  {
    name: 'setEyeColor',
    description: 'Set the eye color. Supports hexadecimal color codes (e.g., #ffffff) or color names',
    parameters: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
          description: 'Color value, supports hexadecimal format (e.g., #ffffff) or color names (e.g., white, cyan, green, red, yellow, purple, orange, blue)'
        }
      },
      required: ['color']
    }
  },
  {
    name: 'setBackgroundColor',
    description: 'Set the background color. Supports hexadecimal color codes',
    parameters: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
          description: 'Background color value in hexadecimal format (e.g., #0a0a0a)'
        }
      },
      required: ['color']
    }
  },
  {
    name: 'setColors',
    description: 'Set both eye color and background color simultaneously',
    parameters: {
      type: 'object',
      properties: {
        eyeColor: {
          type: 'string',
          description: 'Eye color value, supports hexadecimal format or color names'
        },
        bgColor: {
          type: 'string',
          description: 'Background color value in hexadecimal format'
        }
      },
      required: ['eyeColor', 'bgColor']
    }
  },
  {
    name: 'openEyes',
    description: 'Open the eyes',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'closeEyes',
    description: 'Close the eyes',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'blink',
    description: 'Perform a blink action',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'startLaughAnimation',
    description: 'Start laugh animation (eyes shake up and down)',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'stopLaughAnimation',
    description: 'Stop laugh animation',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'startConfusedAnimation',
    description: 'Start confused animation (eyes shake left and right)',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'stopConfusedAnimation',
    description: 'Stop confused animation',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'setFlicker',
    description: 'Set eye flicker effect (enable or disable)',
    parameters: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
          description: 'Whether to enable flicker effect'
        }
      },
      required: ['active']
    }
  },
  {
    name: 'startThinkingAnimation',
    description: 'Start thinking animation (show thinking effect)',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'stopThinkingAnimation',
    description: 'Stop thinking animation',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'startSpeakingAnimation',
    description: 'Start speaking animation (show speaking effect)',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'stopSpeakingAnimation',
    description: 'Stop speaking animation',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'setAutoblink',
    description: 'Set auto blink feature',
    parameters: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
          description: 'Whether to enable auto blink'
        },
        interval: {
          type: 'number',
          description: 'Blink interval in seconds, default 3 seconds',
          default: 3
        },
        variation: {
          type: 'number',
          description: 'Interval variation range in seconds, default 2 seconds',
          default: 2
        }
      },
      required: ['active']
    }
  },
  {
    name: 'setIdleMode',
    description: 'Set idle mode (randomly move eye positions)',
    parameters: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
          description: 'Whether to enable idle mode'
        },
        interval: {
          type: 'number',
          description: 'Position change interval in seconds, default 3 seconds',
          default: 3
        },
        variation: {
          type: 'number',
          description: 'Interval variation range in seconds, default 1 second',
          default: 1
        }
      },
      required: ['active']
    }
  },
  {
    name: 'setPositionRange',
    description: 'Set the range of eye position movement (affects the maximum distance the eyes can move)',
    parameters: {
      type: 'object',
      properties: {
        range: {
          type: 'number',
          description: 'Position movement range (between 0 and 1), larger value means larger eye movement range',
          minimum: 0,
          maximum: 1
        }
      },
      required: ['range']
    }
  },
  {
    name: 'setCustomEyeConfig',
    description: 'Set custom eye configuration (shape, size, border radius, rotation, etc.)',
    parameters: {
      type: 'object',
      properties: {
        shape: {
          type: 'string',
          enum: ['ELLIPSE', 'RECTANGLE', 'ROUNDED_RECT'],
          description: 'Eye shape: ELLIPSE (ellipse), RECTANGLE (rectangle), ROUNDED_RECT (rounded rectangle)'
        },
        leftEye: {
          type: 'object',
          properties: {
            scaleX: {
              type: 'number',
              description: 'Left eye X-axis scale (0.1 to 2.0)',
              minimum: 0.1,
              maximum: 2.0
            },
            scaleY: {
              type: 'number',
              description: 'Left eye Y-axis scale (0.1 to 2.0)',
              minimum: 0.1,
              maximum: 2.0
            }
          }
        },
        rightEye: {
          type: 'object',
          properties: {
            scaleX: {
              type: 'number',
              description: 'Right eye X-axis scale (0.1 to 2.0)',
              minimum: 0.1,
              maximum: 2.0
            },
            scaleY: {
              type: 'number',
              description: 'Right eye Y-axis scale (0.1 to 2.0)',
              minimum: 0.1,
              maximum: 2.0
            }
          }
        },
        borderRadius: {
          type: 'number',
          description: 'Border radius (between 0 and 1)',
          minimum: 0,
          maximum: 1
        },
        rotation: {
          type: 'number',
          description: 'Rotation angle in degrees',
          minimum: -180,
          maximum: 180
        }
      }
    }
  }
];

/**
 * Color name to hexadecimal color mapping
 */
export const COLOR_MAP = {
  white: '#ffffff',
  cyan: '#00d4ff',
  green: '#00ff00',
  red: '#ff0000',
  yellow: '#ffff00',
  purple: '#ff00ff',
  orange: '#ff8800',
  blue: '#0088ff'
};

/**
 * Convert color name to hexadecimal color
 * @param {string} color - Color name or hexadecimal color
 * @returns {string} Hexadecimal color code
 */
export function normalizeColor(color) {
  if (color.startsWith('#')) {
    return color;
  }
  return COLOR_MAP[color.toLowerCase()] || color;
}
