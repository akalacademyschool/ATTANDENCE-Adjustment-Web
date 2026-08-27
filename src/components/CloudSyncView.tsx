import React, { useState } from 'react';
import {
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  ExternalLink,
  Database,
  Cloud,
  Layers,
  ArrowUpDown,
  History,
  Check
} from 'lucide-react';
import { SyncLog } from '../types';

interface CloudSyncViewProps {
  syncLogs: SyncLog[];
  onTriggerSync: (dataset: string) => void;
  onExportFullJson: () => void;
  onImportJson: (jsonData: any) => void;
  isSyncing: boolean;
}

export const CloudSyncView: React.FC<CloudSyncViewProps> = ({
  syncLogs,
  onTriggerSync,
  onExportFullJson,
  onImportJson,
  isSyncing
}) => {
  const [sheetUrl, setSheetUrl] = useState(
    'https://docs.google.com/spreadsheets/d/1Akal_BaruSahib_Central_Sync_2026/edit'
  );
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sheetUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onImportJson(parsed);
      } catch (err) {
        alert('Invalid JSON file format. Please upload a valid Akal Academy data backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">
                Google Sheets & Central Cloud Sync
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live bi-directional sync engine for Akal Academy Baru Sahib databases
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onTriggerSync('All Datasets')}
            disabled={isSyncing}
            className={`w-full md:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
              isSyncing
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
            id="btn-sync-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing with Google Sheets...' : 'Sync All Datasets Now'}</span>
          </button>
        </div>
      </div>

      {/* Google Sheet Configuration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Configured Google Sheets Destination</h3>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSyncEnabled}
              onChange={(e) => setAutoSyncEnabled(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <span>Auto-sync on record updates</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            className="flex-1 w-full px-3 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-700 focus:bg-white focus:outline-none"
            placeholder="Google Sheet URL or Script Webhook"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg border border-slate-300 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Layers className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Individual Sync Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Faculty Master</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Teacher profiles, departments, free periods allocation
            </p>
          </div>
          <button
            onClick={() => onTriggerSync('Faculty Master')}
            disabled={isSyncing}
            className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold py-1.5 px-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-sky-600" />
            <span>Sync Faculty</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Timetable Matrix</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              8 Daily periods, class sections, room allocations
            </p>
          </div>
          <button
            onClick={() => onTriggerSync('Timetable Matrix')}
            disabled={isSyncing}
            className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold py-1.5 px-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-sky-600" />
            <span>Sync Matrix</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Attendance Register</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Daily staff check-ins, leaves, substitute assignments
            </p>
          </div>
          <button
            onClick={() => onTriggerSync('Staff Attendance')}
            disabled={isSyncing}
            className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold py-1.5 px-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-sky-600" />
            <span>Sync Attendance</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Student Registry</span>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Enrolled students, guardian contacts, daily roll calls
            </p>
          </div>
          <button
            onClick={() => onTriggerSync('Student Registry')}
            disabled={isSyncing}
            className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold py-1.5 px-2.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-sky-600" />
            <span>Sync Students</span>
          </button>
        </div>
      </div>

      {/* Backup & Restore and Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backup & Restore */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Database className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Database Snapshot & Restore</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Create an offline JSON backup of all teachers, attendance registers, timetable slots, and student enrollments.
          </p>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={onExportFullJson}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Full Database (.JSON)</span>
            </button>

            <label className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-lg border border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Restore from Backup (.JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Sync Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-sm text-slate-900">Sync Activity & Audit Log</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Recent operations</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 max-h-72 overflow-y-auto">
            {syncLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.dataset}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-1.5 py-0.2 rounded">
                      {log.type}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
