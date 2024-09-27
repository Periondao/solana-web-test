/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fanplay.json`.
 */
export type Fanplay = {
  "address": "7B7cEiCLPGKFr2XH2cSQ53BSrbpyyoT4efoGsQFLbZo7",
  "metadata": {
    "name": "fanplay",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createPool",
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "poolAccount",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "poolId",
          "type": "string"
        },
        {
          "name": "gameId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "payout",
      "discriminator": [
        149,
        140,
        194,
        236,
        174,
        189,
        6,
        239
      ],
      "accounts": [
        {
          "name": "poolAccount",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "rake",
          "type": "u64"
        },
        {
          "name": "payoutList",
          "type": {
            "vec": {
              "defined": {
                "name": "payoutItem"
              }
            }
          }
        }
      ]
    },
    {
      "name": "placePick",
      "discriminator": [
        3,
        215,
        3,
        176,
        155,
        59,
        179,
        108
      ],
      "accounts": [
        {
          "name": "poolAccount",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pickSpec",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "poolAccount",
      "discriminator": [
        116,
        210,
        187,
        119,
        196,
        196,
        52,
        137
      ]
    }
  ],
  "types": [
    {
      "name": "payoutItem",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userKey",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "poolAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolId",
            "type": "string"
          },
          {
            "name": "gameId",
            "type": "u32"
          },
          {
            "name": "poolTotal",
            "type": "u64"
          },
          {
            "name": "pickCount",
            "type": "u32"
          },
          {
            "name": "adminKey",
            "type": "pubkey"
          },
          {
            "name": "picks",
            "type": {
              "vec": {
                "defined": {
                  "name": "userPick"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "userPick",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userKey",
            "type": "pubkey"
          },
          {
            "name": "pickSpec",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
