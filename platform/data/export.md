# Data Export

Complete and timely access to messaging data is important for a wide range of tasks such as data warehousing or analysis on user usage and behavior. To support such tasks, the Layer platform provides several options for exporting messaging data.

### Historical Exports

A historical export provides a complete snapshot of the current state of an
application's messaging data at the time of export. Data is exported using a
scatter and gather approach, pulling data from all nodes within the system and
assembling it into a single JSON document that includes the current state of all conversations and messages in the application. Historical exports are
triggered directly via the Platform API and can be requested at most once per day.

### Scheduled Exports

A scheduled export provides an incremental snapshot of your application's activity on a configurable schedule. Unlike historical exports, scheduled exports include individual events detailing when and how application entities have changed. The schema of the export is very similar to that of Webhooks and is functionally analogous to writing all webhook events out to a file.

## Security

As Layer hosts communications that are private and potentially sensitive, we take security very seriously throughout the platform. The data export feature is no exception. All export archives must be secured with RSA encryption using a key size of at least 2048 bits. This key is used to encrypt a copy of an AES key that is used to perform the actual encryption of the archive. This cryptographic protocol provides strong security guarantees and supports simple support for key rotation.

Before you can export any data, you must supply Layer with the public half of an RSA key pair. A key pair can be generated using OpenSSL from any Unix-like operating system (OS X, Linux, FreeBSD, etc) or via any other cryptographic solution capable of producing PEM encoded RSA keys. If OpenSSL is available on the system, then the following snippet can be used to generate a 2048 bit private key named `layer-export-key.pem` in the current working directory and echo its public counterpart to the terminal:

```sh
openssl genrsa -out layer-export-key.pem 2048 && openssl rsa -in layer-export-key.pem -pubout
```

Once the public key has been generated, it must be sent to Layer for use in encrypting export archives. This configuration is performed via the `export_security` resource exposed via the Platform API:

```request
PUT /apps/{app_id}/export_security
```

```json
{
  "public_key": "-----BEGIN PUBLIC KEY-----MII...",
}
```

### Successful Response

```text
200 (OK)
```

The public key can be changed at any time by issuing another `PUT`. The current key in use can be viewed by issuing a `GET` request:

```request
GET /apps/{app_id}/export_security
```

**NOTE**: Export archives are not re-encrypted upon changing the public key. Archive your private keys upon key rotation to ensure
that all archives remain accessible.

### Successful Response

```text
200 (OK)
```

```json
TODO: PUT IN A REAL EXAMPLE BODY
```

## Requesting a Historical Export

A historical export can be requested by issuing an empty `POST` request to the `exports` resource:

```request
POST /apps/{app_id}/exports
```

### Successful Response

```text
202 (Accepted)
```

```json
{
    "aes_iv": null,
    "completed_at": null,
    "created_at": "2016-03-11T17:57:46.501Z",
    "download_url": null,
    "download_url_expiration": null,
    "encrypted_aes_key": null,
    "expired_at": null,
    "id": "layer:///exports/c2ea7b50-e7b2-11e5-9e15-0242ac1101de",
    "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxNGxpyHoXIaCS2PkL53OEvtQ6sUdtoc1unk8rMvCRul9KlBxlwvdUdHp/HpZHW4bumrtU+rFLZZOccU8CawMHMH7cdx/q2vh0sGE39kTD3antdkeLXRRgWg/01X5hzCJIaa1yMa0Pxqu88qo+svDw7mQUHcSoB5PRMC+am+eygiElB3cT656mVhDKyGUpijs0u0s5EKLSX6fFbbjy3zjdYiU8BVcYQeie1x7CB0bT7UbtgzznLHP9bkR97r7tTN1dqYoP0/LCK3SXMV9ol5jw5BsA+/1afjmqo1t7F7Uo55V+m3mNPo7JVI0S773zR1KzF8/oWV81tdSNt5IzGSKoQIDAQAB",
    "started_at": "2016-03-11T17:57:46.566Z",
    "status": "executing",
    "status_url": "https://api.layer.com/apps/c5c08562-3dff-11e4-bd1b-6a99000000e6/exports/c2ea7b50-e7b2-11e5-9e15-0242ac1101de/status",
    "type": "historical"
}
```

```console
curl  -X PUT \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/exports
```

Generating a historical export is a slow operation that may take many hours to complete. The duration is proportional to the amount of messaging data stored within Layer. Because of the processing power consumed during an export operation, no more than one per day may be requested.

### Polling the Status URL

As historical exports can take a long time to complete, a status resource is exposed to allow developers to track progress. The URL is embedded within the body of the export representation on the `status_url` property. This resource can be polled periodically to track the completion of the export.

```request
GET /apps/{app_id}/exports/{export_id}/status
```

```console
curl  -X GET \
      -H 'Accept: application/vnd.layer+json; version=1.1' \
      -H 'Authorization: Bearer TOKEN' \
      -H 'Content-Type: application/json' \
      https://api.layer.com/apps/APP_UUID/exports/EXPORT_ID/status
```

#### Successful Response

```text
202 (Accepted)
```

TODO: Fill in this section with correct data

## Configuring Scheduled Exports

Scheduled exports are configured via the `export_schedule` singleton resource. There are currently only a few
attributes available for configuration:

| Name       | Type             | Description  | Supported Value(s) |
|------------|------------------|--------------|--------------------|
| `interval` | String           | The time interval for emitting the export. | `daily` or `disabled`.
| `events`   | Array of Strings | The events to be included in the export. | Any of: `message.sent`, `message.delivered`, `message.read`, `message.deleted`, `conversation.created`, `conversation.updated.participants`, `conversation.updated.metadata`, `conversation.deleted` |

`PUT /apps/{app_id}/export_schedule`

```json
{
  "interval": "daily",
  "events": ["message.sent",
             "message.delivered",
             "message.read",
             "message.deleted",
             "conversation.created",
             "conversation.updated.participants",
             "conversation.updated.metadata",
             "conversation.deleted"]
}
```

To find out when the next export is scheduled, check the response body or do a `GET` on the same endpoint.

## Retrieving Scheduled Export Settings

Details about the export schedule are available by issuing a `GET` request on the
`export_schedule` resource.

```request
GET /apps/{app_id}/export_schedule
```

| Name       | Type             | Description  |
|------------|------------------|--------------|
| `interval` | String | Execution interval. See above (LINK ME) |
| `last_export_at` | String (ISO 8601 timestamp) | The last time an export was executed. `null` indicates that it never has. |
| `last_export_id` | String | The ID of the last export generated. `null` indicates it never has. |
| `next_export_at` | String (ISO 8601 timestamp) | The next time an export will be executed. |

```json
{
  "interval": "daily",
  "last_export_at": null,
  "last_export_id": null,
  "next_export_at": "2016-04-29T22:01:12+00:00"
}
```

## Managing Exports

All available exports are exposed for management via the `exports` resource. The export representations returned
include details about the public key, status, and secure download URLs for retrieving the encrypted archives.

**NOTE**: Data exports are eventually pruned from the system and should be consumed and archived promptly.

```request
GET /apps/{app_id}/exports
```

### Successful Response

| Name       | Type             | Description  |
|------------|------------------|--------------|
| `aes_iv` | String | A unique initialization vector used to seed the AES encryption process with randomness. |
| `completed_at` | String (ISO 8601 timestamp) | The time that the export was completed. |
| `created_at` | String (ISO 8601 timestamp) | The time that the export was created. |
| `download_url` | String | A secure, expiring URL from which to download the encrypted export archive. Refreshed automatically. |
| `download_url_expires_at` | String (ISO 8601 timestamp) | The time at which the `download_url` will expire. |
| `encrypted_aes_key` | String (ISO 8601 timestamp) | An copy of the AES key used to encrypt the export archive encrypted with the public key. |
| `expired_at` | String (ISO 8601 timestamp) | The time that the export will expire and be purged. (TODO IS THIS RIGHT?) |
| `id` | String | A unique UUID value identifying the export. |
| `public_key` | String | The RSA public key used to encrypt a copy of the AES key that is used to encrypt the archive. |
| `started_at` | String (ISO 8601 timestamp) | Time the export operation started. |
| `status` | String | The status of the export. Either (TODO what are the valid values???) |
| `status_url` | String | The URL for polling export status. |
| `type` | String | The type of export. Either `scheduled` or `historical`. |

```json
[
    {
        "aes_iv": "dvZXo11ZNZcSS3qJ6Vy/cw==",
        "completed_at": "2016-02-22T21:05:40.755Z",
        "created_at": "2016-02-22T21:05:44.471Z",
        "download_url": "https://storage.googleapis.com/export-prod1/scheduled/56b59936-c3ab-11e5-a1d7-f5d113005657/09c97940-d9a8-11e5-921b-0242ac110029-2016022221.tar.gz.enc?GoogleAccessId=749992877108-663m6ofgstp1ihdkejvj7o27oo9e2ln1@developer.gserviceaccount.com&Expires=1456179657&Signature=sGVk5GgKEA%2Bh4AOd5VA2KOU45hoLHavCXnpsMucjdK6M0Y8aXI%2BCAZtixo6l8F3%2FNBimoKza0eBGS7C4%2BUOuM8w7%2B6NkXgFOjZAuHEsJmimphwFUHhqDLjnRujP2q50y6GUl4G33lzA4%2FkpAqxsfNLSDwHsZUyZwDVW%2FX2KSd4s%3D",
        "download_url_expires_at": "2016-02-22T22:20:57.060Z",
        "encrypted_aes_key": "gbwxlNIYLjFmOfWiprfPY+uiiSIA1q2Gpom0zK3ZPdooO4vPz1s0fic8LduiQVsP2lPgHiSCym0Fv2KYiIutgk3bRwPikF7NUcriQLzT80k0Px5iDaGMEHAboMmVL7yDMP+qDkJ5gUsTIOGKPQKML1kjcLTvHc2j15Fhd3RYAcFaJpGJ2ZJW+Q+Ik91mvxsA6jyjO+v1mIEFhWTOTlSLu3OGFCJxj9oxLo0NqLEQVTfOiqwRGsuTiEMTMtgREP70WX4ZoAO1NgEnTaT4r8A430r6JP6Wcz1u84DOgiacA502XiMwpLQDP72ufYpjByip9LtqFSZvr7DVJkVj+cfhyg==",
        "expired_at": null,
        "id": "09c97940-d9a8-11e5-921b-0242ac110029",
        "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxNGxpyHoXIaCS2PkL53OEvtQ6sUdtoc1unk8rMvCRul9KlBxlwvdUdHp/HpZHW4bumrtU+rFLZZOccU8CawMHMH7cdx/q2vh0sGE39kTD3antdkeLXRRgWg/01X5hzCJIaa1yMa0Pxqu88qo+svDw7mQUHcSoB5PRMC+am+eygiElB3cT656mVhDKyGUpijs0u0s5EKLSX6fFbbjy3zjdYiU8BVcYQeie1x7CB0bT7UbtgzznLHP9bkR97r7tTN1dqYoP0/LCK3SXMV9ol5jw5BsA+/1afjmqo1t7F7Uo55V+m3mNPo7JVI0S773zR1KzF8/oWV81tdSNt5IzGSKoQIDAQAB",
        "started_at": "2016-02-22T21:05:44.471Z",
        "status": "completed",
        "status_url": "https://staging-preview-api.layer.com/apps/56b59936-c3ab-11e5-a1d7-f5d113005657/exports/09c97940-d9a8-11e5-921b-0242ac110029/status",
        "type": "scheduled"
    }
]
```

## Decrypting Export Archives

Once an export has been completed and downloaded from the `download_url` via an HTTP `GET`, it must be decrypted and unarchived before the contents is
accessible. Export archives are distributed in the form of a tarball (`.tar.gz`) that has been encrypted with AES-256, a symmetric key algorithm. The
AES key and initialization vector (IV) are embedded in the export JSON representation. The AES key is embedded in the `encrypted_aes_key` property and
has been encrypted using the public key specified by the `public_key` property. In summary, the process looks like:

1. Locate the path to the downloaded encrypted archive. (Export as `ENCRYPTED_TARBALL` in the script below.)
1. Locate the RSA private key that corresponds to the `public_key` in the export JSON. (Export as the `PRIVATE_KEY_PATH` in script below.)
2. Extract the `encrypted_aes_key` and `aes_iv` from the export JSON. (Export as `ENCRYPTED_AES_KEY` and `AES_IV` in script below.)
3. Pass the encrypted archive through `openssl`, supplying the AES-256 initialization vector and key obtained by decrypting the encrypted key with the private RSA key.

The script below performs all of these actions in one shot, producing a decrypted `export.tar.gz` archive. The archive can then be decompressed by executing `tar -xzf export.tar.gz` and will produce an `export.json` file that contains all the events exported.

**NOTE**: Inflating the archive may require use of [GNU Tar](https://www.gnu.org/software/tar/) to extract larger archives because of limitations in the base file format (The error looked like `export.json: Attempt to write to an empty file`).

```sh
# path to the file you just downloaded
export ENCRYPTED_TARBALL=downloaded.tar.gz.enc
# path for the unencrypted tar
export OUTPUT_TAR=export.tar.gz
# path to the private key
export PRIVATE_KEY_PATH=priv.key
# the encrypted_aes_key from the export json
export ENCRYPTED_AES_KEY=gbwxlNIYLjFmOfWiprfPY+uiiSIA1q2Gpom0zK3ZPdooO4vPz1s0fic8LduiQVsP2lPgHiSCym0Fv2KYiIutgk3bRwPikF7NUcriQLzT80k0Px5iDaGMEHAboMmVL7yDMP+qDkJ5gUsTIOGKPQKML1kjcLTvHc2j15Fhd3RYAcFaJpGJ2ZJW+Q+Ik91mvxsA6jyjO+v1mIEFhWTOTlSLu3OGFCJxj9oxLo0NqLEQVTfOiqwRGsuTiEMTMtgREP70WX4ZoAO1NgEnTaT4r8A430r6JP6Wcz1u84DOgiacA502XiMwpLQDP72ufYpjByip9LtqFSZvr7DVJkVj+cfhyg==
# the aes_iv key from the export json
export AES_IV=dvZXo11ZNZcSS3qJ6Vy/cw==

openssl enc -in $ENCRYPTED_TARBALL -out $OUTPUT_TAR -d -aes-256-cbc -K `echo $ENCRYPTED_AES_KEY | base64 --decode | openssl rsautl -decrypt -inkey $PRIVATE_KEY_PATH | hexdump -ve '1/1 "%.2x"'` -iv `echo $AES_IV | base64 --decode | hexdump -ve '1/1 "%.2x"'`
```

## Deleting an Export

Exports are automatically pruned from the system, but can be explicitly deleted if so desired. To do so, issue a `DELETE` request against the export resource:

```request
DELETE /apps/{app_id}/exports/{uuid}
```

### Successful Response

`204 (No Content)`

### Error Responses

`404 (Not Found)`

## Mirroring Data

It can be desirable to maintain a full mirror of Layer data in an external system for the purposes of data warehousing or in order to incorporate messaging data with other business data within a business intelligence or analytics system. In order to do so, the developer would configure export security, then enable scheduled export, trigger a historical export, and import the exported data into the mirror. As each Layer object has a single unique identifier, any overlap can be trivially deduplicated.
