"use client";

import React, { useState } from "react";
import {
  FiHeart,
  FiSend,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiSettings,
  FiStar,
  FiUser,
  FiPlus,
  FiLayers,
  FiHelpCircle,
} from "react-icons/fi";
import { ClayButton } from "./Button";
import { ClayCard, ClayElevatedCard, ClayInset } from "./Card";
import { ClayInput, ClayTextarea, ClaySelect, ClaySearchBar } from "./Input";
import { ClaySwitch, ClayCheckbox, ClayRadioGroup } from "./Switch";
import { ClaySlider } from "./Slider";
import { ClayBadge, ClayChip } from "./Badge";
import { ClayAvatar, ClayAvatarGroup } from "./Avatar";
import { ClayTooltip, ClayDropdown } from "./Dropdown";
import { ClayTabs } from "./Tabs";
import { ClayBreadcrumbs, ClayPagination } from "./Breadcrumbs";
import { ClayModal, ClayDrawer } from "./Modal";
import { ClayProgressBar, ClayCircularProgress, ClayLoader, ClaySkeleton } from "./Progress";
import { ClayAlert, ClayEmptyState, ClayStateCard } from "./Alert";
import { ClayTable } from "./Table";
import { ClayDatePicker, ClayTimePicker } from "./DatePicker";
import { useClayToast } from "./Toast";

export const DesignSystemCatalog: React.FC = () => {
  const { showToast } = useClayToast();

  // Component test states
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputValue, setInputValue] = useState("Tactile Clay Input");
  const [inputError, setInputError] = useState("");
  const [selectVal, setSelectVal] = useState("option2");
  const [searchQuery, setSearchQuery] = useState("");
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioVal, setRadioVal] = useState("b");
  const [sliderVal, setSliderVal] = useState(65);
  const [catalogTab, setCatalogTab] = useState("buttons");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(2);
  const [chips, setChips] = useState(["Civil", "Structural", "IoT", "Sustainable"]);
  const [stateCardType, setStateCardType] = useState<"success" | "error" | "confirmation">("confirmation");

  // Sample table data
  const sampleTableData = [
    { id: "1", component: "ClayButton", category: "Action", tactileDepth: "Elevated 3D", status: "Production" },
    { id: "2", component: "ClayInput", category: "Forms", tactileDepth: "Debossed Inset", status: "Production" },
    { id: "3", component: "ClaySwitch", category: "Selection", tactileDepth: "Inset Rail + Elevated Knob", status: "Production" },
    { id: "4", component: "ClayModal", category: "Overlays", tactileDepth: "Floating High-Elevation", status: "Production" },
  ];

  return (
    <div className="flex flex-col gap-10 text-left w-full">
      {/* Intro Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ClayBadge variant="terracotta" size="md">
            Design Tokens & Primitives
          </ClayBadge>
          <ClayBadge variant="sage" size="md">
            Strict Light Theme
          </ClayBadge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2B2D42]">
          Claymorphism UI Component System
        </h1>
        <p className="text-xs sm:text-sm text-[#5C6479] max-w-3xl leading-relaxed">
          Every component is engineered with pure physical clay lighting: warm off-white surfaces, generous rounded geometry, subtle debossed insets, and soft ambient elevation shadows.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto pb-2">
        <ClayTabs
          tabs={[
            { id: "buttons", label: "Buttons & Actions" },
            { id: "forms", label: "Inputs & Form Controls" },
            { id: "surfaces", label: "Cards & Surfaces" },
            { id: "navigation", label: "Navigation & Tabs" },
            { id: "feedback", label: "Alerts & Feedback" },
            { id: "data", label: "Data, Tables & Calendars" },
          ]}
          activeTab={catalogTab}
          onChange={setCatalogTab}
        />
      </div>

      {/* SECTION 1: BUTTONS */}
      {catalogTab === "buttons" && (
        <div className="flex flex-col gap-8">
          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Button Variants (Primary, Secondary, Tertiary, Destructive, Ghost, Sage, Sky)
            </h3>
            <div className="flex flex-wrap items-center gap-3.5">
              <ClayButton variant="primary">Primary Clay</ClayButton>
              <ClayButton variant="secondary">Secondary Clay</ClayButton>
              <ClayButton variant="tertiary">Tertiary Clay</ClayButton>
              <ClayButton variant="sage">Sage Clay</ClayButton>
              <ClayButton variant="sky">Sky Blue</ClayButton>
              <ClayButton variant="destructive">Destructive</ClayButton>
              <ClayButton variant="ghost">Ghost Button</ClayButton>
            </div>
          </ClayCard>

          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Sizes, Shapes, Icons, Floating & Loading States
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <ClayButton size="sm">Small (sm)</ClayButton>
              <ClayButton size="md">Medium (md)</ClayButton>
              <ClayButton size="lg">Large (lg)</ClayButton>
              <ClayButton isPill>Pill Shaped</ClayButton>
              <ClayButton leftIcon={<FiSend />}>With Icon</ClayButton>
              <ClayButton isIconOnly aria-label="Favorite">
                <FiHeart />
              </ClayButton>
              <ClayButton isFloating variant="primary" isIconOnly aria-label="Add">
                <FiPlus className="text-xl" />
              </ClayButton>
              <ClayButton
                isLoading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 1500);
                }}
              >
                {btnLoading ? "Processing..." : "Click For Loading State"}
              </ClayButton>
              <ClayButton disabled>Disabled Clay</ClayButton>
            </div>
          </ClayCard>
        </div>
      )}

      {/* SECTION 2: FORMS & CONTROLS */}
      {catalogTab === "forms" && (
        <div className="flex flex-col gap-8">
          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Text Inputs, Textareas, Selects & Search Bars
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClayInput
                label="Standard Debossed Input"
                placeholder="Type here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Subtle debossed inset with warm lighting"
              />

              <ClayInput
                label="Input with Left Icon & Validation Error"
                leftIcon={<FiAlertCircle />}
                value="Invalid Value"
                error="Format does not match standard geotechnical spec"
              />

              <ClayInput
                label="Input with Success Indicator"
                value="Verified Engineering Unit"
                success
                helperText="All integrity checks passed"
              />

              <ClaySelect
                label="Tactile Clay Select"
                value={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
                options={[
                  { value: "option1", label: "Eurocode Standard EN 1990" },
                  { value: "option2", label: "AASHTO LRFD Bridge Spec" },
                  { value: "option3", label: "ISO 14040 Lifecycle Assessment" },
                ]}
              />

              <div className="md:col-span-2">
                <ClaySearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  shortcut="⌘K"
                  placeholder="Search design tokens or components..."
                />
              </div>

              <div className="md:col-span-2">
                <ClayTextarea
                  label="Debossed Clay Textarea"
                  rows={3}
                  placeholder="Enter project summary or technical annotations..."
                />
              </div>
            </div>
          </ClayCard>

          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Switches, Checkboxes, Radios, Sliders & Chips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-[#8D99AE] uppercase">
                  Clay Switches (Toggles)
                </span>
                <ClaySwitch
                  checked={switchChecked}
                  onChange={setSwitchChecked}
                  label="Sensor Telemetry"
                  description="Real-time optical strain feed"
                />
                <ClaySwitch
                  checked={!switchChecked}
                  onChange={() => {}}
                  size="sm"
                  label="Compact Switch"
                />
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-[#8D99AE] uppercase">
                  Clay Checkboxes
                </span>
                <ClayCheckbox
                  checked={checkboxChecked}
                  onChange={setCheckboxChecked}
                  label="Seismic Damping Certified"
                  description="Compliant with Richter scale 7.5 standards"
                />
                <ClayCheckbox
                  checked={false}
                  onChange={() => {}}
                  label="Unchecked Checkbox"
                />
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-[#8D99AE] uppercase">
                  Clay Radio Group
                </span>
                <ClayRadioGroup
                  name="demo-radio"
                  value={radioVal}
                  onChange={setRadioVal}
                  options={[
                    { value: "a", label: "Grade 40 Concrete" },
                    { value: "b", label: "Geopolymer Low-Carbon" },
                    { value: "c", label: "Ultra-High Performance" },
                  ]}
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-4">
                <span className="text-xs font-bold text-[#8D99AE] uppercase">
                  Tactile Clay Slider
                </span>
                <ClaySlider
                  label="Tensile Strength Threshold"
                  unit=" MPa"
                  value={sliderVal}
                  onChange={setSliderVal}
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#8D99AE] uppercase">
                  Interactive Clay Chips
                </span>
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <ClayChip
                      key={chip}
                      label={chip}
                      onRemove={() => setChips(chips.filter((c) => c !== chip))}
                    />
                  ))}
                  <ClayChip label="+ Add Tag" onSelect={() => setChips([...chips, `Tag-${chips.length + 1}`])} />
                </div>
              </div>
            </div>
          </ClayCard>
        </div>
      )}

      {/* SECTION 3: SURFACES & ELEVATION */}
      {catalogTab === "surfaces" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ClayCard padding="lg" radius="2xl">
            <ClayBadge variant="neutral" size="sm" className="mb-2">
              Base Elevation
            </ClayBadge>
            <h4 className="text-base font-bold text-[#2B2D42]">ClayCard</h4>
            <p className="text-xs text-[#5C6479] mt-1.5 leading-relaxed">
              Standard surface level elevation for layout content and primary cards.
            </p>
          </ClayCard>

          <ClayElevatedCard padding="lg" radius="2xl">
            <ClayBadge variant="terracotta" size="sm" className="mb-2">
              High Elevation
            </ClayBadge>
            <h4 className="text-base font-bold text-[#2B2D42]">ClayElevatedCard</h4>
            <p className="text-xs text-[#5C6479] mt-1.5 leading-relaxed">
              Deeper outer shadow and subtle top-left highlight for hero sections and priority widgets.
            </p>
          </ClayElevatedCard>

          <ClayInset padding="lg" radius="2xl">
            <ClayBadge variant="sky" size="sm" className="mb-2">
              Debossed Well
            </ClayBadge>
            <h4 className="text-base font-bold text-[#2B2D42]">ClayInset</h4>
            <p className="text-xs text-[#5C6479] mt-1.5 leading-relaxed">
              Sunken debossed clay surface ideal for input groupings, code blocks, or rail tracks.
            </p>
          </ClayInset>
        </div>
      )}

      {/* SECTION 4: NAVIGATION & OVERLAYS */}
      {catalogTab === "navigation" && (
        <div className="flex flex-col gap-8">
          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Breadcrumbs & Pagination
            </h3>
            <div className="flex flex-col gap-6">
              <ClayBreadcrumbs
                items={[
                  { label: "Home" },
                  { label: "Civilathon 2026" },
                  { label: "Smart Infrastructure" },
                  { label: "Bridge Telemetry Spec" },
                ]}
              />

              <div className="pt-2">
                <ClayPagination
                  currentPage={page}
                  totalPages={8}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </ClayCard>

          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Modals, Drawers & Dropdowns
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <ClayButton variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Clay Modal
              </ClayButton>

              <ClayButton variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                Open Slide-out Drawer
              </ClayButton>

              <ClayDropdown
                trigger={
                  <ClayButton variant="secondary" rightIcon={<FiSettings />}>
                    Settings Menu
                  </ClayButton>
                }
                items={[
                  { id: "1", label: "Project Settings", icon: <FiSettings /> },
                  { id: "2", label: "Assign Reviewer", icon: <FiUser /> },
                  {
                    id: "3",
                    label: "Archive Record",
                    icon: <FiTrash2 />,
                    destructive: true,
                    onClick: () =>
                      showToast({
                        type: "warning",
                        title: "Archival Requested",
                        message: "The record was queued for audit.",
                      }),
                  },
                ]}
              />

              <ClayTooltip content="Tactile tooltip with gentle clay highlight" position="top">
                <ClayButton variant="tertiary" leftIcon={<FiHelpCircle />}>
                  Hover For Tooltip
                </ClayButton>
              </ClayTooltip>
            </div>
          </ClayCard>

          {/* Modal Demo */}
          <ClayModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Sculpted Clay Dialog"
            description="Fully tactile dialog container with soft backdrop"
            footer={
              <>
                <ClayButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </ClayButton>
                <ClayButton
                  variant="primary"
                  onClick={() => {
                    setIsModalOpen(false);
                    showToast({
                      type: "success",
                      title: "Action Confirmed",
                      message: "The dialog confirmed your selection.",
                    });
                  }}
                >
                  Save Changes
                </ClayButton>
              </>
            }
          >
            <p className="text-xs sm:text-sm text-[#5C6479] leading-relaxed">
              This dialog demonstrates the physical clay aesthetic: a warm off-white container, soft rounded geometry, smooth spring animation, and accessible keyboard dismissal.
            </p>
          </ClayModal>

          {/* Drawer Demo */}
          <ClayDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title="Engineering Properties Drawer"
            footer={
              <ClayButton variant="primary" onClick={() => setIsDrawerOpen(false)}>
                Done
              </ClayButton>
            }
          >
            <div className="flex flex-col gap-4 text-xs text-[#5C6479]">
              <p>Configure telemetry frequencies and sensor thresholds.</p>
              <ClaySlider label="Sampling Rate (Hz)" min={10} max={200} value={60} onChange={() => {}} />
              <ClaySwitch label="Live Telemetry Broadcast" checked={true} onChange={() => {}} />
            </div>
          </ClayDrawer>
        </div>
      )}

      {/* SECTION 5: FEEDBACK, ALERTS & TOASTS */}
      {catalogTab === "feedback" && (
        <div className="flex flex-col gap-8">
          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Clay Alert Banners
            </h3>
            <div className="flex flex-col gap-3">
              <ClayAlert
                type="info"
                title="Municipal Code Update"
                description="New guidelines for sustainable concrete aggregates take effect next month."
                onClose={() => {}}
              />
              <ClayAlert
                type="success"
                title="Verification Complete"
                description="Structural integrity calculation verified against ISO standards."
                onClose={() => {}}
              />
              <ClayAlert
                type="warning"
                title="Corrosion Risk Notice"
                description="Coastal zone moisture levels exceed baseline threshold."
                onClose={() => {}}
              />
              <ClayAlert
                type="destructive"
                title="Sensor Fault Detected"
                description="Strain gauge #4 on Pier 3 is reporting intermittent loss of signal."
                onClose={() => {}}
              />
            </div>
          </ClayCard>

          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Interactive Toasts, Loaders & Progress Indicators
            </h3>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <ClayButton
                variant="sage"
                onClick={() =>
                  showToast({
                    type: "success",
                    title: "Proposal Approved",
                    message: "The jury passed Phase 2 verification.",
                  })
                }
              >
                Trigger Success Toast
              </ClayButton>

              <ClayButton
                variant="destructive"
                onClick={() =>
                  showToast({
                    type: "error",
                    title: "Calculation Mismatch",
                    message: "Finite element model did not converge.",
                  })
                }
              >
                Trigger Error Toast
              </ClayButton>

              <ClayButton
                variant="sky"
                onClick={() =>
                  showToast({
                    type: "info",
                    title: "Peer Evaluation Waiting",
                    message: "A new review has been assigned to you.",
                  })
                }
              >
                Trigger Info Toast
              </ClayButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#EAE6DC]">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#8D99AE]">Clay Progress Bar</span>
                <ClayProgressBar value={72} color="terracotta" label="Curing Progress" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-[#8D99AE]">Circular Loader</span>
                <ClayCircularProgress value={85} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-[#8D99AE]">Bouncing Clay Pebbles</span>
                <div className="h-14 flex items-center justify-center">
                  <ClayLoader size="md" />
                </div>
              </div>
            </div>
          </ClayCard>

          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              State Cards (Empty, Error, Success, Confirmation)
            </h3>
            <div className="flex gap-2 mb-4">
              <ClayButton
                size="sm"
                variant={stateCardType === "confirmation" ? "primary" : "secondary"}
                onClick={() => setStateCardType("confirmation")}
              >
                Confirmation State
              </ClayButton>
              <ClayButton
                size="sm"
                variant={stateCardType === "success" ? "sage" : "secondary"}
                onClick={() => setStateCardType("success")}
              >
                Success State
              </ClayButton>
              <ClayButton
                size="sm"
                variant={stateCardType === "error" ? "destructive" : "secondary"}
                onClick={() => setStateCardType("error")}
              >
                Error State
              </ClayButton>
            </div>

            <ClayStateCard
              state={stateCardType}
              title={
                stateCardType === "confirmation"
                  ? "Authorize Milestone Release?"
                  : stateCardType === "success"
                  ? "Milestone Grant Released!"
                  : "Release Halted by Audit"
              }
              description={
                stateCardType === "confirmation"
                  ? "This will transfer $50,000 in municipal engineering funds to the project team."
                  : stateCardType === "success"
                  ? "The funds have been settled into the team's project treasury."
                  : "Sensor telemetry data was incomplete during the last 48-hour cycle."
              }
              onConfirm={() =>
                showToast({
                  type: "success",
                  title: "Action Processed",
                  message: "State card response recorded.",
                })
              }
            />
          </ClayCard>
        </div>
      )}

      {/* SECTION 6: DATA, TABLES & CALENDARS */}
      {catalogTab === "data" && (
        <div className="flex flex-col gap-8">
          <ClayCard radius="2xl" padding="lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4">
              Clay Table Component
            </h3>
            <ClayTable
              columns={[
                { key: "component", header: "Component Name", sortable: true },
                { key: "category", header: "Category" },
                { key: "tactileDepth", header: "Molded Lighting" },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <ClayBadge variant="sage" size="sm" withDot>
                      {row.status}
                    </ClayBadge>
                  ),
                },
              ]}
              data={sampleTableData}
              keyExtractor={(r) => r.id}
            />
          </ClayCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClayCard radius="2xl" padding="lg" className="flex flex-col items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4 self-start">
                Clay Date Picker / Mini Calendar
              </h3>
              <ClayDatePicker />
            </ClayCard>

            <ClayCard radius="2xl" padding="lg" className="flex flex-col items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#4F5D73] mb-4 self-start">
                Clay Time Picker & Skeletons
              </h3>
              <ClayTimePicker />

              <div className="w-full mt-6 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#8D99AE]">Clay Skeletons</span>
                <ClaySkeleton variant="text" width="60%" />
                <ClaySkeleton variant="text" width="90%" />
                <ClaySkeleton variant="rectangular" height={40} />
              </div>
            </ClayCard>
          </div>
        </div>
      )}
    </div>
  );
};
