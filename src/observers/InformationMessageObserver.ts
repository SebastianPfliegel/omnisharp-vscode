/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as ObservableEvent from "../omnisharp/loggingEvents";
import { vscode } from '../vscodeAdapter';
import  showInformationMessage from "./utils/ShowInformationMessage";

export class InformationMessageObserver {
    constructor(private vscode: vscode) {
    }

    public post = (event: ObservableEvent.BaseEvent) => {
        switch (event.constructor.name) {
            case ObservableEvent.OmnisharpServerUnresolvedDependencies.name:
                this.handleOmnisharpServerUnresolvedDependencies(<ObservableEvent.OmnisharpServerUnresolvedDependencies>event);
                break;
        }
    }

    private async handleOmnisharpServerUnresolvedDependencies(event: ObservableEvent.OmnisharpServerUnresolvedDependencies) {
        //to do: determine if we need the unresolved dependecies message
        let csharpConfig = this.vscode.workspace.getConfiguration('csharp');
        if (!csharpConfig.get<boolean>('suppressDotnetRestoreNotification')) {
            let message = `There are unresolved dependencies in the solution'. Please execute the restore command to continue.`;
            return showInformationMessage(this.vscode, message, { title: "Restore", command: "dotnet.restore.all" });
        }
    }
}
