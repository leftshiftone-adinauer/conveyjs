/**
 * @author benjamin.krenn@leftshift.one - 3/11/19.
 * @since 0.1.0
 */
import {AudioRecorder} from "./AudioRecorder";
// @ts-ignore
import * as RecordRTC from "recordrtc";

export class WebRTCRecorder implements AudioRecorder {

    private recordRTC: Promise<any>;
    private static INSTANCE: WebRTCRecorder;

    private constructor(recordRTC: any) {
        this.recordRTC = recordRTC;
    }

    public static instance(): AudioRecorder {
        return this.INSTANCE || (this.INSTANCE = new this(WebRTCRecorder.initializeAudioContext()));
    }

    public async startRecording(): Promise<void> {
        try {
            const r = await this.recordRTC;
            r.startRecording();
        } catch (e) {
            console.error(`could not initialize audio context: ${e}`);
        }
    }

    public async stopRecording(): Promise<string> {
        const recorder = await this.recordRTC;
        await recorder.stopRecording();
        const reader = new FileReader();
        reader.readAsDataURL(await recorder.getBlob());
        return new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
                this.recordRTC = WebRTCRecorder.initializeAudioContext();
                resolve(WebRTCRecorder.removeMimeType(reader.result as string));
            };
            reader.onerror = () => reject(new Error("could not transform recorded data to base64"));
        });

    }

    /**
     * Initializes the browser audio context
     */
    private static async initializeAudioContext(): Promise<any> {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
        return new RecordRTC.RecordRTCPromisesHandler(stream, WebRTCRecorder.rtcConfig());
    }

    /**
     * Removes the: 'data:[<mediatype>][;base64],' part from the given url string
     * @param dataUrl
     */
    private static removeMimeType(dataUrl: string) : string {
        const split = dataUrl.split(",");
        if (split.length < 2) {
            throw new Error("received invalid data url");
        }
        return dataUrl.split(",")[1];
    }

    /**
     * RecordRTC audio recording configuration
     * @see https://recordrtc.org
     */
    private static rtcConfig(): any {
        return {
            type: 'audio',
            recorderType: RecordRTC.StereoAudioRecorder,
            mimeType: 'audio/wav',
            desiredSampRate: 16 * 1000, // nuance requires a sample rate of 16kHz or below
            numberOfAudioChannels: 1
        };
    }

}
